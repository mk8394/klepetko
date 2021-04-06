using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Socket.Quobject.SocketIoClientDotNet.Client;

public class Player {
	public string id;
	public string username;
};

public class ChatData {
	public string id;
	public string msg;
};

public class NetworkClient : MonoBehaviour
{
    public string serverURL = "http://localhost:3000";

	public InputField uiUsernameInput = null;
	public Button uiPlayGame = null;

	public Text uiChatLog = null;
    public InputField uiChatInput = null;
	public Button uiChatSend = null;

	protected QSocket socket = null;
	protected List<string> chatLog = new List<string> (); 

	void Destroy() {
		DoClose ();
	}

	// Use this for initialization
	void Start () {
		DoOpen ();

		uiChatSend.onClick.AddListener(() => {
			SendChat(uiChatInput.text);
			uiChatInput.text = "";
			uiChatInput.ActivateInputField();
		});
	}
	
	// Update is called once per frame
	void Update () {
		lock (chatLog) {
			if (chatLog.Count > 0) {
				string str = uiChatLog.text;
				foreach (var s in chatLog) {
					str = str + "\n" + s;
				}
				uiChatLog.text = str;
				chatLog.Clear ();
			}
		}
	}

    // Establish connection with server
	void DoOpen() {
		if (socket == null) {
			socket = IO.Socket (serverURL);
			socket.On (QSocket.EVENT_CONNECT, () => {
				lock(chatLog) {
					// Access to Unity UI is not allowed in a background thread, so let's put into a shared variable
					chatLog.Add("Socket.IO connected.");
				}
			});

            // Recieve chat message from server
			socket.On ("chat", (data) => {
				string str = data.ToString();

				ChatData chat = JsonUtility.FromJson<ChatData> (str);
				string strChatLog = "user#" + chat.id + ": " + chat.msg;

				// Access to Unity UI is not allowed in a background thread, so let's put into a shared variable
				lock(chatLog) {
					chatLog.Add(strChatLog);
				}
			});
		}
	}

	void DoClose() {
		if (socket != null) {
			socket.Disconnect ();
			socket = null;
		}
	}

	void SendChat(string str) {
		if (socket != null) {
			socket.Emit ("chat", str);
		}
	}
}
