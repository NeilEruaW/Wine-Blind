import assert from 'node:assert/strict';
import { webkit, devices } from 'playwright';

const browser=await webkit.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13']});
const page=await context.newPage();
const pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e)));

const wait=()=>page.waitForTimeout(120);
const active=async sel=>page.locator(sel).evaluate(el=>el.classList.contains('active'));

try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  assert.equal(await active('#typeRed'),true,'red must be active initially');

  const whiteTapStarted=Date.now();
  await page.locator('#typeWhite').tap();
  assert.ok(Date.now()-whiteTapStarted<250,'white toggle handler blocked visual feedback');
  await wait();
  assert.equal(await active('#typeWhite'),true,'white toggle did not activate');
  await page.locator('#typeRed').tap(); await wait();
  assert.equal(await active('#typeRed'),true,'red toggle did not reactivate');

  const geometry=await page.locator('#structureFields .sat-continuum').first().evaluate(track=>{
    const r=track.getBoundingClientRect(),pts=[...track.querySelectorAll('.sat-point')];
    const a=pts[0].getBoundingClientRect(),b=pts.at(-1).getBoundingClientRect();
    const ps=getComputedStyle(track,'::before');
    return {first:(a.left+a.width/2)-r.left,last:(b.left+b.width/2)-r.left,left:parseFloat(ps.left),right:r.width-parseFloat(ps.right)};
  });
  assert.ok(Math.abs(geometry.first-geometry.left)<1.5,`left SAT mismatch ${JSON.stringify(geometry)}`);
  assert.ok(Math.abs(geometry.last-geometry.right)<1.5,`right SAT mismatch ${JSON.stringify(geometry)}`);

  const firstRail=page.locator('#structureFields .sat-continuum').first();
  await firstRail.locator('.sat-point').nth(1).tap(); await wait();
  assert.ok((await page.locator('#structureFields .sat-value').first().textContent()).trim(),'SAT value was not selected');

  const acidRail=page.locator('#structureFields .sat-field').filter({hasText:'Acidité'}).locator('.sat-continuum');
  await acidRail.locator('.sat-point').nth(3).tap(); await wait();
  await page.locator('#typeWhite').tap(); await wait();
  assert.equal(await active('#typeWhite'),true,'white toggle failed after acidity input');
  await page.locator('#typeRed').tap(); await wait();
  assert.equal(await active('#typeRed'),true,'red toggle failed after acidity input');

  const aroma=page.locator('#markerFields .aroma-group').first();
  const aromaTapStarted=Date.now();
  await aroma.locator('.aroma-chip').tap();
  assert.ok(Date.now()-aromaTapStarted<250,'aroma family handler blocked visual feedback');
  await wait();
  const secondAroma=page.locator('#markerFields .aroma-group').nth(1);
  await secondAroma.locator('.aroma-chip').tap(); await wait();
  assert.equal(await page.locator('#markerFields .aroma-group.selected').count(),2,'two aroma families could not stay open');
  const selectedGroup=page.locator('#markerFields .aroma-group.selected').first();
  await selectedGroup.locator('.descriptor-chip').nth(0).tap(); await wait();
  await page.locator('#markerFields .aroma-group.selected').first().locator('.descriptor-chip').nth(1).tap(); await wait();
  assert.ok(await page.locator('#markerFields .descriptor-chip.active').count()>=2,'multiple aroma descriptors were not retained');
  assert.match((await page.locator('#diagnosticConfidence').textContent())||'',/Saisie · [5-9]\d* repères/,'input indicator did not update after structure, families and descriptors');

  try{
    await page.locator('#grapeResults .c2-result-card').first().waitFor({state:'visible',timeout:10000});
  }catch{
    const debug=await page.evaluate(()=>({
      engine:typeof window.WineBlindEngine?.score,
      candidate:window.WINE_BLIND_CANDIDATE?.candidate_id||null,
      indicator:document.querySelector('#diagnosticConfidence')?.textContent?.trim(),
      results:document.querySelector('#grapeResults')?.textContent?.trim(),
      values:[...document.querySelectorAll('#structureFields .sat-value')].map(x=>x.textContent.trim()),
      selected:[...document.querySelectorAll('#markerFields .descriptor-chip.active')].map(x=>x.textContent.trim())
    }));
    assert.fail(`C2-C2 results missing after 10s · ${JSON.stringify(debug)} · page errors: ${pageErrors.join(' | ')}`)
  }
  await page.locator('#grapeResults .c2-result-card').first().tap();
  await page.locator('#detailDialog[open]').waitFor({state:'visible'});
  assert.notEqual((await page.locator('#detailDialog .identity-signature strong').textContent())?.trim(),(await page.locator('#grapeResults .result-meta').first().textContent())?.trim(),'blind signature was replaced by profile origin/style');
  await page.locator('#closeDialog').tap();
  await page.locator('#detailDialog').waitFor({state:'hidden'});

  const diagnosticBeforeTree=await page.evaluate(()=>({
    values:[...document.querySelectorAll('#structureFields .sat-value')].map(x=>x.textContent.trim()),
    groups:[...document.querySelectorAll('#markerFields .aroma-group.selected > .aroma-chip')].map(x=>x.textContent.trim()),
    descriptors:[...document.querySelectorAll('#markerFields .descriptor-chip.active')].map(x=>x.textContent.trim())
  }));

  await page.locator('.tab[data-tab="reference"]').tap(); await wait();
  assert.equal(await active('.tab[data-tab="reference"]'),true,'reference tab is not active');
  await page.locator('.tab[data-tab="tree"]').tap(); await wait();
  assert.equal(await active('.tab[data-tab="tree"]'),true,'tree tab is not active');

  // The visible question must always have a live private current question, including
  // after the white/red lifecycle resets performed earlier in this journey.
  await page.locator('#treeYes').tap(); await wait();
  assert.equal(await page.locator('#adaptiveHistory .adaptive-history-item').count(),1,'tree answer was not recorded');
  assert.equal((await page.locator('#adaptiveHistory .adaptive-history-item small').first().textContent())?.trim(),'Oui','tree recorded the wrong answer');
  assert.ok((await page.locator('#treeStep').textContent())?.includes('1 réponses'),'tree UI did not acknowledge the answer');
  const diagnosticAfterTree=await page.evaluate(()=>({
    values:[...document.querySelectorAll('#structureFields .sat-value')].map(x=>x.textContent.trim()),
    groups:[...document.querySelectorAll('#markerFields .aroma-group.selected > .aroma-chip')].map(x=>x.textContent.trim()),
    descriptors:[...document.querySelectorAll('#markerFields .descriptor-chip.active')].map(x=>x.textContent.trim())
  }));
  assert.deepEqual(diagnosticAfterTree,diagnosticBeforeTree,'standalone tree modified the Diagnostic inputs');

  await page.locator('.tab[data-tab="grape"]').tap(); await wait();
  await page.locator('#resetAll').tap(); await wait();
  assert.equal(await active('#typeRed'),true,'reset did not restore red');
  assert.equal(await page.locator('#markerFields .aroma-group.selected').count(),0,'reset left selected aroma groups');
  const values=await page.locator('#structureFields .sat-value').allTextContents();
  assert.ok(values.every(v=>!v.trim()),'reset left structure values selected');
  assert.ok((await page.locator('#diagnosticConfidence').textContent()).includes('Aucun repère'),'input indicator was not cleared');

  await page.locator('.tab[data-tab="quiz"]').tap(); await wait();
  assert.equal(await active('.tab[data-tab="quiz"]'),true,'quiz tab is not active');
  await page.locator('.tab[data-tab="reference"]').tap(); await wait();
  assert.equal(await active('.tab[data-tab="reference"]'),true,'reference tab failed after reset');

  const refRow=page.locator('#referenceList .ref-row:not(.origin-ref-row)').first();
  await refRow.waitFor({state:'visible'});
  await refRow.tap();
  await page.locator('#detailDialog[open]').waitFor({state:'visible'});
  assert.ok(await page.locator('#detailDialog .metric[class*="metric-level-"]').count()>0,'reference metrics lost progressive colour classes');

  assert.deepEqual(pageErrors,[],`browser page errors: ${pageErrors.join(' | ')}`);
  console.log('Wine Blind V11.0.7 iPhone WebKit navigation: PASS');
} finally {
  await browser.close();
}
