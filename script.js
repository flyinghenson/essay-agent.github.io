// 全局变量
let currentFile = null;
let test = undefined;
let newTest = undefined;
let uploadedDocuments = {
    summary: null,
    qa: null,
    format: null
};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    setupTabNavigation();
    setupFileUpload();
    setupDragAndDrop();
}

// 设置标签页导航
function setupTabNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // 移除所有活动状态
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前活动状态
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// 设置文件上传
function setupFileUpload() {
    // 摘要模块文件上传
    document.getElementById('summaryFile').addEventListener('change', function(e) {
        handleFileUpload(e.target.files[0], 'summary');
    });

    // 问答模块文件上传
    document.getElementById('qaFile').addEventListener('change', function(e) {
        handleFileUpload(e.target.files[0], 'qa');
    });

    // 格式检查模块文件上传
    document.getElementById('formatFile').addEventListener('change', function(e) {
        handleFileUpload(e.target.files[0], 'format');
    });
}

// 设置拖拽上传
function setupDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('dragleave', handleDragLeave);
        area.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const moduleType = e.currentTarget.id.replace('Upload', '').toLowerCase();
        handleFileUpload(files[0], moduleType);
    }
}

// 处理文件上传
function handleFileUpload(file, moduleType) {
    if (!file) return;

    // 验证文件类型
    const allowedTypes = {
        summary: ['.pdf', '.doc', '.docx', '.txt'],
        qa: ['.pdf', '.doc', '.docx', '.txt'],
        format: ['.doc', '.docx']
    };

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes[moduleType].includes(fileExtension)) {
        alert(`不支持的文件格式。${moduleType}模块支持格式：${allowedTypes[moduleType].join(', ')}`);
        return;
    }

    // 检查文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过10MB');
        return;
    }

    // 存储文件
    uploadedDocuments[moduleType] = file;
    
    // 更新UI
    updateUploadStatus(moduleType, file.name);
    
    // 特殊处理问答模块
    if (moduleType === 'qa') {
        showChatInterface();
    }
}

// 更新上传状态
function updateUploadStatus(moduleType, fileName) {
    const uploadArea = document.getElementById(`${moduleType}Upload`);
    uploadArea.innerHTML = `
        <div class="upload-icon">✅</div>
        <p>文件上传成功</p>
        <p class="upload-hint">${fileName}</p>
        <button class="upload-btn" onclick="document.getElementById('${moduleType}File').click()">重新选择</button>
    `;
}

// 显示聊天界面
function showChatInterface() {
    document.getElementById('chatSection').style.display = 'flex';
    
    // 模拟文档解析过程
    showLoading('正在解析文档内容...');
    setTimeout(() => {
        hideLoading();
        addSystemMessage('文档已上传成功！请提出您想了解的问题，我会基于论文内容为您解答。');
    }, 2000);
}

// 生成摘要
function generateSummary() {
    if (!uploadedDocuments.summary) {
        alert('请先上传文档');
        return;
    }

    const summaryType = document.getElementById('summaryType').value;
    const summaryLang = document.getElementById('summaryLang').value;
    
    showLoading('正在生成摘要...');
    
    // 模拟AI生成过程
    setTimeout(() => {
        hideLoading();
        
        const mockSummary = generateMockSummary(summaryType, summaryLang);
        displaySummaryResult(mockSummary);
    }, 3000);
}

// 生成模拟摘要
function generateMockSummary(type, lang) {
    const summaries = {
        brief: {
            zh: `## 简要摘要

本研究探讨了人工智能在学术研究中的应用前景。通过对比分析不同AI模型的性能表现，发现深度学习技术在文献分析、知识提取等方面具有显著优势。研究结果表明，AI技术能够有效提升学术研究的效率和质量，为未来的科研工作提供了新的思路和方法。

**关键词：** 人工智能、学术研究、深度学习、文献分析`,
            
            en: `## Brief Summary

This study explores the application prospects of artificial intelligence in academic research. Through comparative analysis of different AI models' performance, deep learning technology shows significant advantages in literature analysis and knowledge extraction. The results indicate that AI technology can effectively improve the efficiency and quality of academic research, providing new ideas and methods for future research work.

**Keywords:** Artificial Intelligence, Academic Research, Deep Learning, Literature Analysis`
        },
        
        detailed: {
            zh: `## 详细摘要

### 研究背景
随着人工智能技术的快速发展，其在学术研究领域的应用日益广泛。传统的文献综述和知识提取方法面临着效率低下、主观性强等问题，迫切需要新的技术手段来改善这一现状。

### 研究方法
本研究采用了定量分析和实验验证相结合的方法，选取了GPT、BERT、T5等主流AI模型，在标准化数据集上进行了性能测试。同时，通过用户调研和专家评估，对AI辅助研究的实际效果进行了评价。

### 主要发现
1. 深度学习模型在文本理解和信息提取方面表现优异
2. AI技术能够显著提升文献检索和分析的准确性
3. 自动化摘要生成质量接近人工水平
4. 跨语言处理能力为国际化研究提供支持

### 研究结论
AI技术在学术研究中具有巨大潜力，能够有效解决传统方法的局限性。建议学术机构积极引入AI工具，建立相应的评价体系和使用规范。

**关键词：** 人工智能、学术研究、深度学习、文献分析、自动化摘要`,
            
            en: `## Detailed Summary

### Background
With the rapid development of artificial intelligence technology, its application in academic research has become increasingly widespread. Traditional literature review and knowledge extraction methods face problems such as low efficiency and strong subjectivity, urgently requiring new technical means to improve this situation.

### Methodology
This study adopts a combination of quantitative analysis and experimental verification, selecting mainstream AI models such as GPT, BERT, and T5 for performance testing on standardized datasets. Meanwhile, through user surveys and expert evaluations, the actual effectiveness of AI-assisted research was assessed.

### Key Findings
1. Deep learning models perform excellently in text understanding and information extraction
2. AI technology can significantly improve the accuracy of literature retrieval and analysis
3. Automated summary generation quality approaches human-level performance
4. Cross-language processing capabilities provide support for international research

### Conclusions
AI technology has enormous potential in academic research and can effectively address the limitations of traditional methods. It is recommended that academic institutions actively introduce AI tools and establish corresponding evaluation systems and usage standards.

**Keywords:** Artificial Intelligence, Academic Research, Deep Learning, Literature Analysis, Automated Summarization`
        }
    };

    if (lang === 'both') {
        return summaries[type].zh + '\n\n---\n\n' + summaries[type].en;
    }
    
    return summaries[type][lang] || summaries[type].zh;
}

// 显示摘要结果
function displaySummaryResult(content) {
    const resultSection = document.getElementById('summaryResult');
    const resultContent = document.getElementById('summaryContent');
    
    resultContent.innerHTML = marked.parse(content);
    resultSection.style.display = 'block';
    
    // 滚动到结果区域
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 处理回车键发送
function handleEnter(event) {
    if (event.key === 'Enter') {
        sendQuestion();
    }
}

// 发送问题
function sendQuestion() {
    const input = document.getElementById('questionInput');
    const question = input.value.trim();
    
    if (!question) return;
    
    // 添加用户消息
    addUserMessage(question);
    
    // 清空输入框
    input.value = '';
    
    // 模拟AI回答
    setTimeout(() => {
        const answer = generateMockAnswer(question);
        addAIMessage(answer);
    }, 1500);
}

// 快速提问
function askQuestion(question) {
    document.getElementById('questionInput').value = question;
    sendQuestion();
}

// 添加用户消息
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 添加AI消息
function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            ${marked.parse(message)}
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 添加系统消息
function addSystemMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 生成模拟回答
function generateMockAnswer(question) {
    const answers = {
        '主要研究内容': '基于我对您上传论文的分析，该研究的主要内容包括：\n\n1. **研究目标**：探索人工智能在学术研究中的应用潜力\n2. **核心问题**：如何提升传统文献分析的效率和准确性\n3. **技术方案**：采用深度学习模型进行文本理解和知识提取\n4. **实验设计**：在标准数据集上对比不同AI模型的性能表现\n\n论文通过系统性的实验验证了AI技术在学术研究中的有效性。',
        
        '研究方法': '论文采用了以下研究方法：\n\n**1. 实验研究法**\n- 选取GPT、BERT、T5等主流AI模型\n- 在标准化数据集上进行性能测试\n\n**2. 对比分析法**\n- 横向对比不同模型的表现\n- 纵向分析技术发展趋势\n\n**3. 用户调研**\n- 收集实际使用者的反馈\n- 评估AI工具的实用性\n\n**4. 专家评估**\n- 邀请领域专家进行质量评价\n- 验证研究结论的可靠性',
        
        '创新点': '该研究的主要创新点体现在：\n\n**技术创新**\n- 首次将多种AI模型系统性地应用于学术研究场景\n- 提出了跨语言文献分析的新方法\n\n**方法创新**\n- 建立了AI辅助研究的评价体系\n- 设计了人机协作的工作流程\n\n**应用创新**\n- 实现了自动化文献摘要生成\n- 开发了智能问答系统\n\n这些创新为学术研究的数字化转型提供了重要支撑。',
        
        '研究结论': '研究得出以下主要结论：\n\n**1. 技术可行性**\n- AI技术在文献分析中表现出色\n- 自动化摘要质量接近人工水平\n\n**2. 应用价值**\n- 显著提升研究效率\n- 降低人工成本\n- 提高分析准确性\n\n**3. 发展前景**\n- AI将成为学术研究的重要工具\n- 需要建立相应的使用规范\n- 人机协作是未来发展方向\n\n**4. 实施建议**\n- 学术机构应积极引入AI工具\n- 建立评价体系和质量标准\n- 加强相关人员培训'
    };

    // 简单的关键词匹配
    for (let key in answers) {
        if (question.includes(key) || question.includes(key.replace(/[？?]/g, ''))) {
            return answers[key];
        }
    }

    // 默认回答
    return `基于我对论文的理解，关于"${question}"这个问题：\n\n论文中涉及了相关内容，主要观点是人工智能技术在学术研究中具有重要应用价值。通过深度学习等先进技术，可以有效提升文献分析、知识提取等工作的效率和质量。\n\n具体来说，研究表明AI工具能够：\n- 自动处理大量文献数据\n- 提供准确的信息提取\n- 支持多语言内容分析\n- 生成高质量的研究摘要\n\n如果您需要了解更具体的细节，请提供更详细的问题描述。`;
}

// 格式检查
function checkFormat() {
    if (!uploadedDocuments.format) {
        alert('请先上传文档');
        return;
    }

    const formatStandard = document.getElementById('formatStandard').value;
    
    showLoading('正在检查格式...');
    
    setTimeout(() => {
        hideLoading();
        displayFormatResult(formatStandard);
    }, 2500);
}

// 显示格式检查结果
function displayFormatResult(standard) {
    const resultSection = document.getElementById('formatResult');
    const issuesList = document.getElementById('issuesList');
    
    // 模拟检查结果
    const mockIssues = generateMockFormatIssues(standard);
    
    // 更新统计信息
    document.getElementById('issueCount').textContent = mockIssues.length;
    document.getElementById('autoFixCount').textContent = mockIssues.filter(issue => issue.autoFixable).length;
    
    // 生成问题列表
    issuesList.innerHTML = mockIssues.map(issue => `
        <div class="issue-item ${issue.severity}">
            <div class="issue-title">${issue.title}</div>
            <div class="issue-description">${issue.description}</div>
        </div>
    `).join('');
    
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 生成模拟格式问题
function generateMockFormatIssues(standard) {
    const issues = [
        {
            title: '标题格式不规范',
            description: '一级标题应使用小二号黑体，当前使用了三号字体',
            severity: 'warning',
            autoFixable: true
        },
        {
            title: '行距设置错误',
            description: '正文行距应为1.5倍，当前为单倍行距',
            severity: 'error',
            autoFixable: true
        },
        {
            title: '参考文献格式问题',
            description: '参考文献[3]缺少页码信息',
            severity: 'warning',
            autoFixable: false
        },
        {
            title: '图表标题位置错误',
            description: '表格标题应在表格上方，图片标题应在图片下方',
            severity: 'info',
            autoFixable: true
        },
        {
            title: '页边距不符合要求',
            description: '左边距应为3cm，当前为2.5cm',
            severity: 'error',
            autoFixable: true
        }
    ];

    return issues.slice(0, Math.floor(Math.random() * 3) + 3); // 随机返回3-5个问题
}

// 一键修正所有问题
function autoFixAll() {
    showLoading('正在自动修正格式问题...');
    
    setTimeout(() => {
        hideLoading();
        alert('格式修正完成！已生成修正后的文档。');
        
        // 更新统计信息
        document.getElementById('issueCount').textContent = '0';
        document.getElementById('autoFixCount').textContent = '0';
        
        // 清空问题列表
        document.getElementById('issuesList').innerHTML = `
            <div class="issue-item info">
                <div class="issue-title">✅ 所有问题已修正</div>
                <div class="issue-description">文档格式已符合${document.getElementById('formatStandard').selectedOptions[0].text}标准</div>
            </div>
        `;
    }, 3000);
}

// 复制摘要
function copySummary() {
    const content = document.getElementById('summaryContent').innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert('摘要已复制到剪贴板');
    });
}

// 下载摘要
function downloadSummary() {
    const content = document.getElementById('summaryContent').innerText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '文献摘要.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// 下载修正后的文档
function downloadCorrected() {
    alert('修正后的文档已开始下载');
    // 这里应该实现实际的文档下载功能
}

// 生成检查报告
function generateReport() {
    showLoading('正在生成检查报告...');
    
    setTimeout(() => {
        hideLoading();
        alert('格式检查报告已生成并开始下载');
        // 这里应该实现实际的报告生成和下载功能
    }, 2000);
}

// 显示加载状态
function showLoading(text = '处理中...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    loadingText.textContent = text;
    overlay.style.display = 'flex';
}

// 隐藏加载状态
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 