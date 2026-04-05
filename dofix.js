const fs = require('fs');

// 1. globals.css
let css = fs.readFileSync('app/globals.css', 'utf8');
css = css.replace('background: rgba(5, 5, 5, 0.98);', 'background: #050505;');
css = css.replace('.nav {\n    padding: 1rem 1rem 1rem 2.5rem;', '.nav {\n    padding: 1rem 1.5rem 1rem 1.5rem;\n    margin-left: -1.5rem;\n    margin-right: -1.5rem;');
fs.writeFileSync('app/globals.css', css);

// 2. MobileNav.tsx
let mobileNav = fs.readFileSync('app/[lang]/components/MobileNav.tsx', 'utf8');
mobileNav = mobileNav.replace('background: #0a0a0a;', 'background: #050505;');
fs.writeFileSync('app/[lang]/components/MobileNav.tsx', mobileNav);

// 3. page.tsx
let pageTsx = fs.readFileSync('app/[lang]/page.tsx', 'utf8');
pageTsx = pageTsx.replace('<h2 className="section-title">Featured Highlights</h2>', '<h2 className="section-title">{lang === \\'zh\\' ? \\'精選特輯\\' : \\'Featured Highlights\\'}</h2>');
fs.writeFileSync('app/[lang]/page.tsx', pageTsx);

// 4. Experience page
let expTsx = fs.readFileSync('app/[lang]/experience/page.tsx', 'utf8');

// nSchool desc
expTsx = expTsx.replace(
  '輔導超過 50 位學員完成個人分析作品集，包含自動化流程與 AI 系統建置。',
  '輔導超過50位學生，完成近百件數據分析專案，涵蓋Python資料分析、建模、視覺化、n8n自動化、AI系統建置等。'
);

// Cathay title
expTsx = expTsx.replace('資料分析師 (Data Analyst Specialist)', '資料分析師');

// Carrefour text update
expTsx = expTsx.replace(
  '運用集成分群分析與機器學習演算法開發顧客購買預測模型。在萬人規模的全國專案競賽中脫穎而出，最終贏得全國冠軍與最佳模型獎 (Best Model Award)。',
  '運用集成分群分析與 XGBoost 等機器學習演算法開發顧客購買預測模型。在萬人規模的全國專案競賽中脫穎而出，最終贏得全國冠軍與最佳模型獎 (Best Model Award)。'
);

// Partner roles to 合作講師 without english
expTsx = expTsx.replace(/合作講師 \\(Partner Instructor\\)/g, '合作講師');

// Partners section replace
const oldPartners = <a href="https://www.xplatform.world/" target="_blank" rel="noopener follow" className="partner-logo">
             X Platform
          </a>
          <a href="https://kkschool.kolable.app/" target="_blank" rel="noopener follow" className="partner-logo">
             無限學院 <span style={{ fontWeight: 400, marginLeft: '0.2rem', fontSize: '1rem' }}>nSchool</span>
          </a>
          <a href="https://www.ooschool.cc/" target="_blank" rel="noopener follow" className="partner-logo">
             OOSchool
          </a>
          <a href="https://live.rookiesavior.net/" target="_blank" rel="noopener follow" className="partner-logo">
             菜鳥救星 <span style={{ fontWeight: 400, marginLeft: '0.2rem', fontSize: '1rem' }}>Rookie Savior</span>
          </a>;
const newPartners = <a href="https://www.xplatform.world/" target="_blank" rel="noopener follow" className="partner-logo">
             X Platform
          </a>
          <a href="https://kkschool.kolable.app/" target="_blank" rel="noopener follow" className="partner-logo">
             無限學院 <span style={{ fontWeight: 400, marginLeft: '0.2rem', fontSize: '1rem' }}>nSchool</span>
          </a>
          <a href="https://www.ooschool.cc/" target="_blank" rel="noopener follow" className="partner-logo">
             OOSchool
          </a>
          <a href="https://live.rookiesavior.net/" target="_blank" rel="noopener follow" className="partner-logo">
             菜鳥救星 <span style={{ fontWeight: 400, marginLeft: '0.2rem', fontSize: '1rem' }}>Rookie Savior</span>
          </a>;

fs.writeFileSync('app/[lang]/experience/page.tsx', expTsx);
