import { expect, test } from '@playwright/test';
import { writerArchives, writerAreas } from '../content/reading';

test('writers have distinct names, valid categories, and free reading links',()=>{
 expect(writerArchives.length).toBe(38);
 expect(new Set(writerArchives.map(writer=>writer.name)).size).toBe(writerArchives.length);
 for(const writer of writerArchives){
  expect(writerAreas.some(area=>area.id===writer.area)).toBe(true);
  expect(writer.url).toMatch(/^https:\/\//);
  expect(writer.subscription).toBe(false);
 }
});

test('Writers menu opens the library; filters and search work',async({page})=>{
 await page.goto('/');
 await page.getByRole('link',{name:'Writers',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Writers',exact:true})).toBeVisible();
 await expect(page.locator('.writer-card')).toHaveCount(38);
 await page.getByRole('button',{name:/Journalism & reportage/}).click();
 await expect(page.locator('.writer-card')).toHaveCount(writerArchives.filter(writer=>writer.area==='reportage').length);
 await expect(page.getByRole('heading',{name:'Tom Wolfe',exact:true})).toBeVisible();
 await page.getByLabel('Find a writer, title, or technique').fill('Talese');
 await expect(page.locator('.writer-card')).toHaveCount(1);
 await expect(page.getByRole('heading',{name:'Gay Talese'})).toBeVisible();
 await page.getByRole('button',{name:/All areas/}).click();
 await page.getByLabel('Find a writer, title, or technique').fill('no-match-xyz');
 await expect(page.locator('.writer-card')).toHaveCount(0);
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('.writer-card')).toHaveCount(38);
});
