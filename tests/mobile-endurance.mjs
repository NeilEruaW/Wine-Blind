import assert from 'node:assert/strict';
import { webkit, devices } from 'playwright';

const browser=await webkit.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13']});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));

const active=sel=>page.locator(sel).evaluate(el=>el.classList.contains('active'));
const fastTap=async(locator,label)=>{
  await locator.tap();
};
const handlerCost=locator=>locator.evaluate(el=>{const start=performance.now();el.click();return performance.now()-start});

try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});

  // Measure only synchronous application work, excluding Playwright's locator,
  // stability and touch-emulation overhead.
  const whiteCost=await handlerCost(page.locator('#typeWhite'));
  const redCost=await handlerCost(page.locator('#typeRed'));
  assert.ok(whiteCost<100&&redCost<100,`type handlers too slow: white ${whiteCost.toFixed(1)} ms, red ${redCost.toFixed(1)} ms`);
  const measuredGroup=page.locator('#markerFields .aroma-group').first();
  const familyCost=await handlerCost(measuredGroup.locator('.aroma-chip'));
  const descriptorCost=await handlerCost(measuredGroup.locator('.descriptor-chip').first());
  assert.ok(familyCost<100&&descriptorCost<100,`aroma handlers too slow: family ${familyCost.toFixed(1)} ms, descriptor ${descriptorCost.toFixed(1)} ms`);
  await measuredGroup.locator('.aroma-chip').tap();

  // Repeatedly reverse every common choice, without waiting for a ranking render.
  // This deliberately outruns the 180 ms coalescing window.
  for(let round=0;round<24;round++){
    const white=round%2===0;
    const type=page.locator(white?'#typeWhite':'#typeRed');
    await fastTap(type,`type toggle ${round}`);
    assert.equal(await active(white?'#typeWhite':'#typeRed'),true,`type state lost at round ${round}`);
    assert.ok(!(await page.locator('#diagnosticConfidence').textContent())?.includes('Confiance'),`legacy confidence returned at round ${round}`);

    const groups=page.locator('#markerFields .aroma-group');
    const group=groups.nth(round%6);
    await fastTap(group.locator('.aroma-chip'),`aroma group ${round}`);
    if(await group.evaluate(el=>el.classList.contains('selected'))){
      const descriptors=group.locator('.descriptor-chip');
      await fastTap(descriptors.nth(round%Math.min(3,await descriptors.count())),`descriptor ${round}`);
    }

    if(round%3===0){
      const acid=page.locator('#structureFields .sat-field').filter({hasText:'Acidité'}).locator('.sat-point');
      await fastTap(acid.nth((round/3)%5),`acid reversal ${round}`);
    }
  }

  // Leave several aroma families and descriptors selected simultaneously.
  for(let i=0;i<4;i++){
    const group=page.locator('#markerFields .aroma-group').nth(i);
    if(!(await group.evaluate(el=>el.classList.contains('selected')))) await fastTap(group.locator('.aroma-chip'),`final family ${i}`);
    const descriptor=group.locator('.descriptor-chip').first();
    if(!(await descriptor.evaluate(el=>el.classList.contains('active')))) await fastTap(descriptor,`final descriptor ${i}`);
  }
  assert.ok(await page.locator('#markerFields .aroma-group.selected').count()>=4,'families did not remain independently open');
  assert.ok(await page.locator('#markerFields .descriptor-chip.active').count()>=4,'descriptors did not remain independently selected');

  await page.waitForTimeout(700);
  assert.equal(await page.locator('#grapeResults .podium').count(),3,'top-three podium icons disappeared after stress interactions');
  assert.ok(!(await page.locator('#diagnosticConfidence').textContent())?.includes('Confiance'),'legacy confidence survived final render');
  assert.match((await page.locator('#diagnosticConfidence').textContent())||'',/^Saisie · \d+ repères?$/,'input counter is stale');
  assert.deepEqual(errors,[],`page errors: ${errors.join(' | ')}`);
  console.log('Wine Blind V11.0.7 iPhone WebKit endurance: PASS (24 type reversals + aroma/structure bursts)');
} finally {
  await browser.close();
}
