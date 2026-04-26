from flask import Flask
import os
import threading

app = Flask(__name__)

@app.route('/')
def home():
    return "Bot is Live!"

def run_bot():
    # Yahan apna WhatsApp bot ka asli logic likho
    print("WhatsApp Bot starting...")
    # Example: yahan aapka library ka code aayega

if __name__ == "__main__":
    # Bot ko background mein chalane ke liye thread
    threading.Thread(target=run_bot).start()
    
    # Render ke liye Port binding
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
