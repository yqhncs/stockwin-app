/**
 * quiz.js — 交互式答题系统
 * 用法：在每个页面底部引入 <script src="_shared/js/quiz.js"></script>
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var section = document.querySelector('.quiz-section') || document.querySelector('.quiz-card');
    if (!section) return;

    // 1. 隐藏答案
    var answers = section.querySelectorAll('.q-answer');
    answers.forEach(function (el) {
      el.style.display = 'none';
    });

    // 2. 给选项添加交互
    var labels = section.querySelectorAll('.q-opt');
    labels.forEach(function (label) {
      var input = label.querySelector('input');
      if (!input) return;
      input.addEventListener('change', function () {
        if (input.type === 'radio') {
          var name = input.name;
          section.querySelectorAll('input[name="' + name + '"]').forEach(function (r) {
            r.closest('.q-opt').classList.remove('selected');
          });
        }
        label.classList.toggle('selected', input.checked);
      });
    });

    // 3. 注入提交按钮和分数区域
    var scoreArea = document.createElement('div');
    scoreArea.id = 'quiz-score-area';
    scoreArea.style.cssText = 'display:none; margin: 28px 0; text-align:center;';
    section.appendChild(scoreArea);

    var btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'text-align:center; margin: 24px 0 8px;';
    btnWrap.innerHTML = '<button id="quiz-submit-btn" onclick="quizSubmit()" style="' +
      'padding: 14px 48px; font-size: 17px; font-weight: 600; color: #fff; ' +
      'background: linear-gradient(135deg, #2563eb, #1d4ed8); border: none; border-radius: 12px; ' +
      'cursor: pointer; transition: opacity 0.2s; font-family: inherit;' +
      '" onmouseover="this.style.opacity=\'0.85\'" onmouseout="this.style.opacity=\'1\'"' +
      '>提交全部答案</button>';
    section.appendChild(btnWrap);
  });

  window.quizSubmit = function () {
    var section = document.querySelector('.quiz-section') || document.querySelector('.quiz-card');
    if (!section) return;

    var items = section.querySelectorAll('.quiz-item');
    var total = items.length;
    var correct = 0;
    var wrongItems = [];

    items.forEach(function (item, idx) {
      var answerEl = item.querySelector('.q-answer');
      if (!answerEl) return;
      var rightAnswer = answerEl.getAttribute('data-answer') || '';
      var explain = answerEl.getAttribute('data-explain') || '';

      var radios = item.querySelectorAll('input[type="radio"]:checked');
      var checks = item.querySelectorAll('input[type="checkbox"]:checked');
      var userAnswers = [];

      if (radios.length > 0) {
        radios.forEach(function (r) { userAnswers.push(r.value); });
      } else if (checks.length > 0) {
        checks.forEach(function (c) { userAnswers.push(c.value); });
      }

      var userStr = userAnswers.sort().join('');
      var rightStr = rightAnswer.replace(/[^A-D对错]/g, '').split('').sort().join('');

      var isCorrect = userStr === rightStr;
      if (isCorrect) correct++;

      // 禁用输入
      item.querySelectorAll('input').forEach(function (inp) { inp.disabled = true; });

      // 标记选项颜色
      var rightSet = new Set(rightAnswer.replace(/[^A-D对错]/g, '').split(''));
      var userSet = new Set(userAnswers);
      var labels = item.querySelectorAll('.q-opt');
      labels.forEach(function (label) {
        var input = label.querySelector('input');
        if (!input) return;
        var val = input.value;
        if (rightSet.has(val)) {
          label.classList.add('opt-correct');
        } else if (userSet.has(val) && !rightSet.has(val)) {
          label.classList.add('opt-wrong');
        }
      });

      // 题号旁对错标记
      var qText = item.querySelector('.q-text');
      if (qText) {
        var badge = document.createElement('span');
        badge.style.cssText = 'display:inline-block; margin-left: 10px; padding: 2px 10px; border-radius: 6px; font-size: 13px; font-weight: 600;';
        if (isCorrect) {
          badge.style.cssText += 'background: #dcfce7; color: #166534;';
          badge.textContent = '✓ 正确';
        } else {
          badge.style.cssText += 'background: #fee2e2; color: #991b1b;';
          badge.textContent = '✗ 错误';
          wrongItems.push({ idx: idx + 1, text: qText.textContent, right: rightAnswer, explain: explain });
        }
        qText.appendChild(badge);
      }

      // 显示答案
      answerEl.style.display = 'block';
      if (isCorrect) {
        answerEl.innerHTML = '';
        answerEl.style.cssText += ' background: rgba(22, 101, 52, 0.06); border-left-color: #22c55e;';
        var s = document.createElement('strong');
        s.style.color = '#166534';
        s.textContent = '正确答案：' + rightAnswer;
        answerEl.appendChild(s);
      } else {
        answerEl.style.cssText += ' background: rgba(153, 27, 27, 0.05); border-left-color: #ef4444;';
      }
    });

    // 显示成绩
    var scoreArea = document.getElementById('quiz-score-area');
    if (scoreArea) {
      var pct = Math.round(correct / total * 100);
      var grade, gradeColor;
      if (pct >= 90) { grade = '优秀'; gradeColor = '#166534'; }
      else if (pct >= 75) { grade = '良好'; gradeColor = '#1d4ed8'; }
      else if (pct >= 60) { grade = '及格'; gradeColor = '#d97706'; }
      else { grade = '需要加强'; gradeColor = '#991b1b'; }

      var html = '<div style="background: rgba(255,255,255,0.8); border: 2px solid var(--rule); border-radius: 16px; padding: 28px; display: inline-block; min-width: 300px;">';
      html += '<div style="font-size: 40px; font-weight: 700; color: ' + gradeColor + '; margin-bottom: 4px;">' + correct + ' / ' + total + '</div>';
      html += '<div style="font-size: 15px; color: var(--muted); margin-bottom: 4px;">正确率 ' + pct + '%，等级：<strong style="color:' + gradeColor + '">' + grade + '</strong></div>';

      if (wrongItems.length > 0) {
        html += '<div style="margin-top: 20px; text-align: left; max-width: 560px;">';
        html += '<div style="font-size: 15px; font-weight: 600; color: #991b1b; margin-bottom: 10px;">错题回顾（共 ' + wrongItems.length + ' 题）</div>';
        wrongItems.forEach(function (w) {
          html += '<div style="background: rgba(239,68,68,0.04); border-left: 3px solid #fca5a5; border-radius: 0 8px 8px 0; padding: 12px 14px; margin-bottom: 10px; font-size: 14px; line-height: 1.7;">';
          html += '<div style="font-weight: 600; margin-bottom: 4px; color: var(--ink);">第' + w.idx + '题：' + w.text + '</div>';
          html += '<div style="color: #166534;">正确答案：' + w.right + '</div>';
          html += '<div style="color: var(--muted); margin-top: 2px;">' + w.explain + '</div>';
          html += '</div>';
        });
        html += '</div>';
      }
      html += '</div>';
      scoreArea.innerHTML = html;
      scoreArea.style.display = 'block';
    }

    var btn = document.getElementById('quiz-submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '已提交';
      btn.style.cssText += ' background: #9ca3af; cursor: not-allowed; opacity: 0.7;';
    }

    if (scoreArea) {
      scoreArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
})();