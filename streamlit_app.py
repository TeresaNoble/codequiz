import re
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Quick Code Quiz", page_icon="📝")
st.markdown("""
<style>
  [data-testid="stAppViewContainer"], [data-testid="stApp"] {
    background-color: #6A9BCC;
  }
</style>
""", unsafe_allow_html=True)
st.title("Quiz")

with open("UI.tsx", "r") as f:
    tsx_content = f.read()

# Strip import lines and remove export keyword
tsx_content = re.sub(r'^import[^\n]+\n', '', tsx_content, flags=re.MULTILINE)
tsx_content = tsx_content.replace('export default function App()', 'function App()')

ICON_DEFS = """
const CheckCircle = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);
const XCircle = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <path d="m15 9-6 6M9 9l6 6"/>
  </svg>
);
"""

html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body style="margin:0">
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
const { useState, useEffect } = React;
""" + ICON_DEFS + tsx_content + """
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>"""

components.html(html, height=1100, scrolling=True)
