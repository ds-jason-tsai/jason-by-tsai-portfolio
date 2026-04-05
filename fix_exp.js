const fs = require('fs');
let expTsx = fs.readFileSync('app/[lang]/experience/page.tsx', 'utf8');

expTsx = expTsx.replace(
  '輔導超過 50 位學員完成個人分析作品集，包含自動化流程與 AI 系統建置。',
  '輔導超過50位學生，完成近百件數據分析專案，涵蓋Python資料分析、建模、視覺化、n8n自動化、AI系統建置等。'
);

expTsx = expTsx.replace('資料分析師 (Data Analyst Specialist)', '資料分析師');

expTsx = expTsx.replace(
  '運用集成分群分析與機器學習演算法開發顧客購買預測模型。在萬人規模的全國專案競賽中脫穎而出，最終贏得全國冠軍與最佳模型獎 (Best Model Award)。',
  '運用集成分群分析與 XGBoost 等機器學習演算法開發顧客購買預測模型，並深入規劃商品搭售策略。在萬人規模的全國專案競賽中脫穎而出，最終贏得全國冠軍與最佳模型獎。'
);

// We replace "合作講師 (Partner Instructor)" with "合作講師"
expTsx = expTsx.split('合作講師 (Partner Instructor)').join('合作講師');

// For the partner logo section update:
// Let's replace the whole trusted-by-section
const startText = '<div className="trusted-by-section"';
const endText = '</section>';
const startIndex = expTsx.indexOf(startText);
const endIndex = expTsx.indexOf(endText);
if(startIndex !== -1 && endIndex !== -1) {
    const newSection = `
      <div className="trusted-by-section" style={{ marginTop: '5rem', marginBottom: '4rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
           Partner Platforms & Multi-Brand Collaboration
        </h3>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <a href="https://www.xplatform.world/" target="_blank" rel="noopener follow" className="partner-logo">
             nSchool/X Platform/無限學院
          </a>
          <a href="https://kkschool.kolable.app/" target="_blank" rel="noopener follow" className="partner-logo" style={{ fontSize: '1rem', opacity: 0.8 }}>
             無限學院官網
          </a>
          <a href="https://www.ooschool.cc/" target="_blank" rel="noopener follow" className="partner-logo" style={{ fontSize: '1rem', opacity: 0.8 }}>
             OOSchool官網
          </a>
          <a href="https://live.rookiesavior.net/" target="_blank" rel="noopener follow" className="partner-logo">
             合作講師
          </a>
        </div>
        <style dangerouslySetInnerHTML={{__html: \`
          .partner-logo {
             font-size: 1.4rem;
             font-weight: 900;
             color: #fff;
             opacity: 0.5;
             text-decoration: none;
             transition: all 0.3s ease;
             letter-spacing: 1px;
             font-family: var(--font-geist-sans), sans-serif;
             display: flex;
             align-items: center;
          }
          .partner-logo:hover {
             opacity: 1;
             color: var(--accent-color);
             transform: translateY(-2px);
          }
        \`}} />
      </div>
    `;
    expTsx = expTsx.substring(0, startIndex) + newSection.trim() + '\n    ' + expTsx.substring(endIndex);
}

fs.writeFileSync('app/[lang]/experience/page.tsx', expTsx);
console.log("Success");
