const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// 送信ボタンがクリックされたときの処理
sendButton.addEventListener('click', sendMessage);

// Enterキーが押されたときの処理
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const messageText = userInput.value.trim();
    if (messageText === '') return;

    // ユーザーのメッセージを画面に表示
    addMessage(messageText, 'user');
    userInput.value = '';

    try {
        // バックエンド（Vercelのサーバーレス関数）にリクエストを送信
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        });

        if (!response.ok) {
            throw new Error('ネットワークの応答が正しくありませんでした。');
        }

        const data = await response.json();
        // Geminiからの返信を画面に表示
        addMessage(data.reply, 'bot');

    } catch (error) {
        console.error('エラー:', error);
        addMessage('エラーが発生しました。もう一度お試しください。', 'bot');
    }
}

// メッセージをチャットボックスに追加する関数
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    // 自動で一番下までスクロール
    chatBox.scrollTop = chatBox.scrollHeight;
}