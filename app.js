{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let tabs = [];\
let activeTabId = null;\
\
class BrowserTab \{\
    constructor(url = "https://www.google.com", isIncognito = false) \{\
        this.id = 'tab-' + Date.now() + Math.random().toString(36).substr(2, 5);\
        this.url = url;\
        this.isIncognito = isIncognito;\
        \
        // Create the webview element native to W10M\
        this.webview = document.createElement('x-ms-webview');\
        this.webview.id = 'wv-' + this.id;\
        this.webview.src = this.url;\
        this.webview.className = "hidden";\
        \
        // Listeners for address updates\
        this.webview.addEventListener("MSWebViewNavigationCompleted", (e) => \{\
            if (activeTabId === this.id) \{\
                document.getElementById('omnibox').value = e.uri;\
            \}\
            this.url = e.uri;\
            this.updateTabTitle(e.uri);\
        \});\
\
        // Simple Download Handling interception\
        this.webview.addEventListener("MSWebViewUnviewableContentIdentified", (e) => \{\
            alert("Download requested for: " + e.uri + "\\n(Saving to system Downloads)");\
            // In a full compiled WinRT app, you would pass e.uri to Windows.Networking.BackgroundTransfer\
        \});\
\
        document.getElementById('webview-container').appendChild(this.webview);\
        this.createTabUI();\
    \}\
\
    createTabUI() \{\
        const tabEl = document.createElement('div');\
        tabEl.id = this.id;\
        tabEl.className = `tab $\{this.isIncognito ? 'incognito-tab' : ''\}`;\
        tabEl.innerText = this.isIncognito ? "Incognito" : "New Tab";\
        tabEl.addEventListener('click', () => switchTab(this.id));\
        document.getElementById('tabs-container').appendChild(tabEl);\
    \}\
\
    updateTabTitle(uri) \{\
        try \{\
            let urlObj = new URL(uri);\
            document.getElementById(this.id).innerText = urlObj.hostname;\
        \} catch(e) \{\
            document.getElementById(this.id).innerText = "Web Page";\
        \}\
    \}\
\}\
\
function createNewTab(url, isIncognito = false) \{\
    let newTab = new BrowserTab(url, isIncognito);\
    tabs.push(newTab);\
    switchTab(newTab.id);\
\}\
\
function switchTab(tabId) \{\
    tabs.forEach(tab => \{\
        if (tab.id === tabId) \{\
            tab.webview.classList.remove('hidden');\
            document.getElementById(tab.id).classList.add('active');\
            document.getElementById('omnibox').value = tab.url;\
            activeTabId = tab.id;\
            \
            // Adjust toolbar color if Incognito\
            document.getElementById('toolbar').style.backgroundColor = tab.isIncognito ? "#2b1d3d" : "#1f1f1f";\
        \} else \{\
            tab.webview.classList.add('hidden');\
            document.getElementById(tab.id).classList.remove('active');\
        \}\
    \});\
\}\
\
// UI Event Handlers\
document.getElementById('new-tab-btn').addEventListener('click', () => createNewTab());\
document.getElementById('incognito-btn').addEventListener('click', () => createNewTab("https://www.google.com", true));\
\
document.getElementById('omnibox').addEventListener('keydown', (e) => \{\
    if (e.key === 'Enter') \{\
        let input = e.target.value;\
        if (!input.startsWith('http://') && !input.startsWith('https://')) \{\
            input = 'https://www.google.com/search?q=' + encodeURIComponent(input);\
        \}\
        let currentTab = tabs.find(t => t.id === activeTabId);\
        if (currentTab) currentTab.webview.src = input;\
    \}\
\});\
\
// Basic Nav controls\
document.getElementById('back-btn').addEventListener('click', () => \{\
    let currentTab = tabs.find(t => t.id === activeTabId);\
    if (currentTab && currentTab.webview.canGoBack) currentTab.webview.goBack();\
\});\
document.getElementById('forward-btn').addEventListener('click', () => \{\
    let currentTab = tabs.find(t => t.id === activeTabId);\
    if (currentTab && currentTab.webview.canGoForward) currentTab.webview.goForward();\
\});\
document.getElementById('refresh-btn').addEventListener('click', () => \{\
    let currentTab = tabs.find(t => t.id === activeTabId);\
    if (currentTab) currentTab.webview.refresh();\
\});\
\
// Initialize with a default tab\
createNewTab();}