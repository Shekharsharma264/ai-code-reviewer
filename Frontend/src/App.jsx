import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

// 🔐 Clerk imports
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton
} from "@clerk/clerk-react";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      setReview(response.data)
    } catch (err) {
      setReview("❌ Error getting review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ❌ If NOT logged in */}
      <SignedOut>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
          <SignIn />
        </div>
      </SignedOut>

      {/* ✅ If logged in */}
      <SignedIn>
        <div className="navbar" style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
          <h2>AI Code Reviewer 🚀</h2>
          <UserButton />
        </div>

        <main>
          <div className="left">
            <div className="code">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  height: "100%",
                  width: "100%"
                }}
              />
            </div>

            <div onClick={reviewCode} className="review">
              {loading ? "Reviewing..." : "Review"}
            </div>
          </div>

          <div className="right">
            {loading ? (
              <p>⏳ AI is reviewing your code...</p>
            ) : (
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </Markdown>
            )}
          </div>
        </main>
      </SignedIn>
    </>
  )
}

export default App