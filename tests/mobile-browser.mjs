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

  // 1. Red/white alternation must remain tappable.
  await page.locator('#typeWhite').tap(); await wait();
  assert.equal(await active('#typeWhite'),true,'white toggle did not activate');
  await page.locator('#typeRed').tap(); await wait();
  assert.equal(await active('#typeRed'),true,'red toggle did not reactivate');

  // 2. SAT rails: first/last dot centres must match visible bar ends.
  const geometry=await page.locator('#structureFields .sat-continuum').first().evaluate(track=>{
    const r=track.getBoundingClientRect(),pts=[...track.querySelectorAll('.sat-point')];
    const a=pts[0].getBoundingClientRect(),b=pts.at(-1).getBoundingClientRect();
    const ps=getComputedStyle(track,'::before');
    return {first:(a.left+a.width/2)-r.left,last:(b.left+b.width/2)-r.left,left:parseFloat(ps.left),right:r.width-parseFloat(ps.right)};
  });
  assert.ok(Math.abs(geometry.first-geometry.left)<1.5,`left SAT mismatch ${JSON.stringify(geometry)}`);
  assert.ok(Math.abs(geometry.last-geometry.right)<1.5,`right SAT mismatch ${JSON.stringify(geometry)}`);

  // 3. Enter structure and aromas using touch; multi-select must survive re-renders.
  const firstRail=page.locator('#structureFields .sat-continuum').first();
  await firstRail.locator('.sat-point').nth(1).tap(); await wait();
  assert.ok((await page.locator('#structureFields .sat-value').first().textContent()).trim(),'SAT value was not selected');

  const aroma=page.locator('#markerFields .aroma-group').first();
  await aroma.locator('.aroma-chip').tap(); await wait();
  const selectedGroup=page.locator('#markerFields .aroma-group.selected').first();
  await selectedGroup.locator('.descriptor-chip').nth(0).tap(); await wait();
  await page.locator('#markerFields .aroma-group.selected').first().locator('.descriptor-chip').nth(1).tap(); await wait();
  assert.ok(await page.locator('#markerFields .descriptor-chip.active').count()>=2,'multiple aroma descriptors were not retained');

  // 4. C2 top 10 must be tappable on iPhone.
  await page.locator('#grapeResults .c2-result-card').first().waitFor({state:'visible'});
  await page.locator('#grapeResults .c2-result-card').first().tap();
  await page.locator('#detailDialog[open]').waitFor({state:'visible'});
  await page.locator('#closeDialog').tap();

  // 5. Navigation must still work after diagnostic data exists.
  await page.locator('.tab[data-tab="reference"]').tap(); await wait();
  assert.equal(await active('.tab[data-tab="reference"]'),true,'reference tab is not active');
  await page.locator('.tab[data-tab="tree"]').tap(); await wait();
  assert.equal(await active('.tab[data-tab="tree"]'),true,'tree tab is not active');

  // 6. Decision tree answers must be tappable after navigation.
  const before=(await page.locator('#treeQuestion').textContent())?.trim();
  await page.locator('#treeYes').tap(); await wait();
  const after=(await page.locator('#treeQuestion').textContent())?.trim();
  const historyCount=await page.locator('#adaptiveHistory .trail-item').count();
  assert.ok(historyCount>0 || (before&&after&&before!==after),'tree answer did not advance state');

  // 7. Return to diagnostic, reset all, and verify stale selections/results are cleared.
  await page.locator('.tab[data-tab="grape"]').tap(); await wait();
  await page.locator('#resetAll').tap(); await wait();
  assert.equal(await active('#typeRed'),true,'reset did not restore red');
  assert.equal(await page.locator('#markerFields .aroma-group.selected').count(),0,'reset left selected aroma groups');
  const values=await page.locator('#structureFields .sat-value').allTextContents();
  assert.ok(values.every(v=>!v.trim()),'reset left structure values selected');
  assert.ok((await page.locator('#diagnosticConfidence').textContent()).includes('Aucun repère'),'input indicator was not cleared');

  // 8. Quiz and references remain reachable after reset.
  await page.locator('.tab[data-tab="quiz"]').tap(); await wait();
  assert.equal(await active('.tab[data-tab="quiz"]'),true,'quiz tab is not active');
  await page.locator('.tab[data-tab="reference"]').tap(); await wait();
  assert.equal(await active('.tab[data-tab="reference"]'),true,'reference tab failed after reset');

  // 9. C2-updated reference sheets keep the historical progressive metric colour classes.
  const refRow=page.locator('#referenceList .ref-row:not(.origin-ref-row)').first();
  await refRow.waitFor({state:'visible'});
  await refRow.tap();
  await page.locator('#detailDialog[open]').waitFor({state:'visible'});
  assert.ok(await page.locator('#detailDialog .metric[class*="metric-level-"]').count()>0,'reference metrics lost progressive colour classes');

  assert.deepEqual(pageErrors,[],`browser page errors: ${pageErrors.join(' | ')}`);
  console.log('Wine Blind V11.0.4 iPhone WebKit navigation: PASS');
} finally {
  await browser.close();
}
