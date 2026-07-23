const fs = require('fs');
const path = require('path');

const learningDir = path.join(__dirname, '..', 'public', 'learning');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'quizData.json');

function extractQuizzes(html) {
  const quizzes = [];
  
  // Match quiz-item blocks
  const itemRegex = /<div class="quiz-item">([\s\S]*?)<\/div>\s*(?=<div class="quiz-item"|<div class="quiz-type-title"|<\/div>\s*<\/div>|\Z)/g;
  let itemMatch;
  
  while ((itemMatch = itemRegex.exec(html)) !== null) {
    const block = itemMatch[1];
    
    // Extract question text
    const textMatch = block.match(/<div class="q-text">(.*?)<\/div>/s);
    if (!textMatch) continue;
    const question = textMatch[1].trim().replace(/^\d+\.\s*/, '');
    
    // Extract options
    const options = [];
    const optRegex = /<label class="q-opt"><input type="radio"[^>]*value="([A-D])"[^>]*>(.*?)<\/label>/gs;
    let optMatch;
    while ((optMatch = optRegex.exec(block)) !== null) {
      let optText = optMatch[2].trim();
      // Clean up option text
      optText = optText.replace(/<[^>]+>/g, '').trim();
      options.push({ label: optMatch[1], text: optText });
    }
    
    if (options.length === 0) {
      // Try alternate format: <p> tags
      const optRegex2 = /<p>([A-D])[\.、]\s*(.*?)<\/p>/gs;
      while ((optMatch = optRegex2.exec(block)) !== null) {
        options.push({ label: optMatch[1], text: optMatch[2].trim() });
      }
    }
    
    // Extract answer
    const answerMatch = block.match(/<div class="q-answer"[^>]*data-answer="([A-D])"[^>]*data-explain="(.*?)"[^>]*>/s);
    let answer = '';
    let explain = '';
    if (answerMatch) {
      answer = answerMatch[1];
      explain = answerMatch[2].trim();
    } else {
      // Try without data-explain
      const answerMatch2 = block.match(/<div class="q-answer"[^>]*data-answer="([A-D])"/);
      if (answerMatch2) {
        answer = answerMatch2[1];
        const explainMatch = block.match(/data-explain="(.*?)"/s);
        if (explainMatch) explain = explainMatch[1].trim();
      }
    }
    
    if (question && options.length > 0) {
      quizzes.push({ question, options, answer, explain });
    }
  }
  
  return quizzes;
}

// Process all day files
const allQuizzes = {};
let totalQuizzes = 0;
let filesWithQuizzes = 0;

for (let day = 1; day <= 270; day++) {
  const fileName = `day${day.toString().padStart(3, '0')}.html`;
  const filePath = path.join(learningDir, fileName);
  
  if (!fs.existsSync(filePath)) continue;
  
  const html = fs.readFileSync(filePath, 'utf-8');
  
  // Check if file has quiz section
  if (!html.includes('quiz-item')) continue;
  
  const quizzes = extractQuizzes(html);
  
  if (quizzes.length > 0) {
    allQuizzes[day] = quizzes;
    totalQuizzes += quizzes.length;
    filesWithQuizzes++;
    console.log(`Day ${day}: ${quizzes.length} questions extracted`);
  }
}

// Write output
const output = JSON.stringify(allQuizzes, null, 0);
fs.writeFileSync(outputFile, output, 'utf-8');

console.log(`\n=== Summary ===`);
console.log(`Files with quizzes: ${filesWithQuizzes}`);
console.log(`Total questions extracted: ${totalQuizzes}`);
console.log(`Output: ${outputFile}`);
