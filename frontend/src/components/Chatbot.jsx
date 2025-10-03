const ChatbotTool = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        text: data.response || data.message || "Sorry, I couldn't generate a response.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="tool-interface chatbot-interface"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        maxHeight: "70vh",
      }}
    >
      <div
        style={{
          padding: "15px",
          borderBottom: "2px solid rgba(0,169,255,0.3)",
          background: "linear-gradient(135deg, rgba(0,169,255,0.2), rgba(88,28,135,0.2))",
        }}
      >
        <h3 style={{ margin: "0", color: "#00a9ff", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaRobot size={24} />
          AI Assistant
        </h3>
        <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#aaa" }}>
          Ask me anything about space, maps, or astronomy!
        </p>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: "50px" }}>
            <FaRobot size={48} style={{ opacity: 0.3, marginBottom: "15px" }} />
            <p>Start a conversation with your AI assistant!</p>
            <div style={{ marginTop: "20px", fontSize: "13px" }}>
              <p style={{ marginBottom: "8px" }}>Try asking:</p>
              <ul style={{ listStyle: "none", padding: 0, color: "#00a9ff" }}>
                <li>• "What are Messier objects?"</li>
                <li>• "Explain star formation"</li>
                <li>• "Tell me about nebulae"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                animation: "fadeIn 0.3s ease-in",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg, #00a9ff, #581c87)"
                      : msg.isError
                      ? "rgba(255, 107, 107, 0.2)"
                      : "rgba(0,0,0,0.3)",
                  border:
                    msg.sender === "user"
                      ? "1px solid rgba(0,169,255,0.5)"
                      : "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  wordWrap: "break-word",
                }}
              >
                <div>{msg.text}</div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: "5px",
                    textAlign: msg.sender === "user" ? "right" : "left",
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div
        style={{
          padding: "15px",
          borderTop: "2px solid rgba(0,169,255,0.3)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "25px",
              border: "1px solid rgba(0,169,255,0.3)",
              background: "rgba(11, 61, 145, 0.3)",
              color: "white",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(0,169,255,0.6)";
              e.target.style.background = "rgba(11, 61, 145, 0.5)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(0,169,255,0.3)";
              e.target.style.background = "rgba(11, 61, 145, 0.3)";
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              padding: "12px 24px",
              borderRadius: "25px",
              border: "none",
              background:
                !inputMessage.trim() || isLoading
                  ? "rgba(100,100,100,0.3)"
                  : "linear-gradient(135deg, #00a9ff, #581c87)",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: !inputMessage.trim() || isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};