
const fs = require('fs');
const path = 'c:/Users/Jason/Desktop/antigravity/app/[lang]/experience/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Chinese (zh)
content = content.replace(
    /date: "2026.01 - Present", \s*role: "合作講師", \s*companies: \[[\s\S]*?\], \s*desc: "[\s\S]*?"/,
    `date: "2026.01 - 至今", 
              role: "合作講師", 
              companies: [
                { name: "nSchool (Kolable)", url: "https://kkschool.kolable.app/" },
                { name: "X Platform", url: "https://www.xplatform.world/" },
                { name: "無限學院 (OOSchool)", url: "https://www.ooschool.cc/" }
              ], 
              desc: "客製化設計 Python 與 AI 學習路徑，及 AI 應用實作課程，打造輕量高效的端到端數據學習體驗。"`
);

// 2. Update English (en)
content = content.replace(
    /date: "2026.01 - Present", \s*role: "Partner Instructor", \s*companies: \[[\s\S]*?\], \s*desc: "[\s\S]*?"/,
    `date: "2026.01 - Present", 
              role: "Partner Instructor", 
              companies: [
                { name: "nSchool (Kolable)", url: "https://kkschool.kolable.app/" },
                { name: "X Platform", url: "https://www.xplatform.world/" },
                { name: "OOSchool", url: "https://www.ooschool.cc/" }
              ], 
              desc: "Customized Python & AI learning paths and end-to-end project implementation, delivering a lightweight and efficient data learning experience."`
);

// 3. Update Japanese (ja)
// First, update the consolidated entry
content = content.replace(
    /date: "2026.01 - 現在", \s*role: "パートナー講師", \s*companies: \[[\s\S]*?\], \s*desc: "[\s\S]*?"/,
    `date: "2026.01 - 現在", 
              role: "パートナー講師", 
              companies: [
                { name: "nSchool (Kolable)", url: "https://kkschool.kolable.app/" },
                { name: "X Platform", url: "https://www.xplatform.world/" },
                { name: "無限学院 (OOSchool)", url: "https://www.ooschool.cc/" }
              ], 
              desc: "PythonとAIの学習パスをカスタマイズ設計し、エンドツーエンドのプロジェクト実践を重視した、軽量で効率的なデータ学習体験を提供します。"`
);

// 4. Remove duplicate "無限学院" entry in Japanese
// This looks for the standalone entry for OOSchool in JA
content = content.replace(
    /\{ date: \"2026.01 - 現在\", role: \"パートナー講師\", company: \"無限学院 \(OOSchool\)\", url: \"https:\/\/www\.ooschool\.cc\/\", desc: \"[\s\S]*?\" \},\s*/,
    ''
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated experience entries.');
