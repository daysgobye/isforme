import { Context, Hono } from 'hono'
import { Content, Html } from './app'
import Messages, { Message } from './components/messages'
import { z } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { SetPW, get, update, updateAllMessages } from './page'
import { PageData } from './types'
import { handleMessages, rpc } from './utils'
import { bearerAuth } from 'hono/bearer-auth'

import Input from './components/input'
import ReadPw from './components/readPw'
import { html } from 'hono/html'

type Bindings = {
    DB: D1Database

}

const app = new Hono<{ Bindings: Bindings }>()
app.use(
    '/api/*',
    bearerAuth({
        verifyToken: async (token: string, c: Context<{
            Bindings: Bindings;
        }, "/api/*", {}>) => {
            const path = `${c.req.path.split("/api").pop()}`.split("/raw").pop() || ""
            const rawpageData = await get(c.env.DB, path)
            if (!rawpageData.readPw) {
                return true
            } else {
                return rawpageData.readPw === token
            }

        },
    })
)
app.get('/api/:path',
    async (c) => {
        const path = `/${c.req.param('path')}`
        const rawpageData = await get(c.env.DB, path)
        const messages = await handleMessages(rawpageData.messages)
        return c.json({ path: rawpageData.path, messages })

    })
app.get('/api/raw/:path', async (c) => {
    const path = `/${c.req.param('path')}`
    const rawpageData = await get(c.env.DB, path)
    return c.json({ path: rawpageData.path, messages: rawpageData.messages })
})
app.post('/api/:path',
    async (c) => {
        const path = `/${c.req.param('path')}`
        const body = await c.req.json();
        const rawpageData = await get(c.env.DB, path)
        const { messages, writePw }: { messages: string[], writePw?: string } = body

        if (rawpageData.writePw && rawpageData.writePw !== writePw) {
            return c.json({ message: "wrong password" }, 403)
        }
        const rawMessages = await updateAllMessages(c.env.DB, rawpageData.path, messages, writePw)
        const handledMessages = await handleMessages(rawMessages)
        return c.json({ path: rawpageData.path, rawMessages, handledMessages })
    })
app.get('/', async (c) => {

    return c.html(
        <Html title={"Home"} theme={"light"}>
            <>

                {html`   <style>
    :root {
        --primary: #ff6b6b;
        --secondary: #4ecdc4;
        --accent: #ffe66d;
        --border-width: 4px;
        --border-radius: 0;
        --font-family: 'Courier New', monospace;
    }

    body {
        font-family: var(--font-family);
        background-color: #f9f9f9;
        overflow-x: hidden;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

   
    /* Hero section */
    .hero {
        padding: 60px 20px;
        text-align: center;
        background-color: var(--accent);
        border-bottom: var(--border-width) solid black;
        position: relative;
        overflow: hidden;
    }

    .hero h1 {
        font-size: 3.5rem;
        margin-bottom: 20px;
        font-weight: 900;
        color: black;
    }

    .hero h1 span {
        color: var(--primary);
    }

    .hero-form {
        max-width: 600px;
        margin: 40px auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .url-input-container {
        display: flex;
        background: white;
        border: var(--border-width) solid black;
        padding: 0;
        box-shadow: 8px 8px 0 black;
    }

    .url-prefix {
        background: #eee;
        padding: 15px;
        font-weight: bold;
        border-right: var(--border-width) solid black;
        white-space: nowrap;
    }

    .url-input {
        flex-grow: 1;
        border: none !important;
        margin: 0 !important;
        box-shadow: none !important;
        font-size: 1.2rem;
        padding: 15px !important;
    }

    .url-input:focus {
        outline: none;
    }

    .go-button {
        background-color: var(--primary);
        color: black;
        font-weight: bold;
        font-size: 1.2rem;
        padding: 15px 30px;
        border: var(--border-width) solid black;
        box-shadow: 6px 6px 0 black;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .go-button:hover {
        transform: translate(-2px, -2px);
        box-shadow: 8px 8px 0 black;
    }

  
    .sticker-1 {
        --rotate: -5deg;
        top: 150px;
        right: 10%;
        width: 280px;
        height: 320px;
    }

    .sticker-2 {
        --rotate: 7deg;
        bottom: -30px;
        left: 15%;
        width: 200px;
        height: 200px;
    }

    .sticker-3 {
        --rotate: -8deg;
        top: 50%;
        right: 5%;
        width: 200px;
        height: 300px;
    }

    .sticker-4 {
        --rotate: 4deg;
        bottom: 20%;
        left: 5%;
        width: 180px;
        height: 140px;
    }

    .sticker img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Content sections */
    .content-section {
        padding: 40px 0;
    }

    h2 {
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 20px;
        position: relative;
        display: inline-block;
    }

    h2::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: var(--primary);
    }

    ul,
    ol {
        padding-left: 20px;
    }

    li {
        margin-bottom: 10px;
    }

    li strong {
        color: var(--primary);
    }

    pre {
        background-color: var(--accent);
        border: var(--border-width) solid black;
        padding: 20px;
        font-style: italic;
        box-shadow: 6px 6px 0 black;
    }

    code {
        background-color: #eee;
        padding: 2px 5px;
        border: 1px solid #ddd;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .hero h1 {
            font-size: 2.5rem;
        }


        .url-input-container {
            flex-direction: column;
        }

        .url-prefix {
            border-right: none;
            border-bottom: var(--border-width) solid black;
        }
    }
</style>`}
                <div class="hero">
                    <div class="container">
                        <h1>ismy.space<span>/</span> - Your Instant Sharable Space</h1>
                        <p>Create your own web space instantly - no signup required!</p>

                        <div class="hero-form">
                            <div class="url-input-container">
                                <div class="url-prefix">ismy.space/</div>
                                <input type="text" class="url-input" id="space-name" placeholder="yourname" />
                            </div>
                            <button class="go-button" id="create-space">MAKE A SPACE</button>
                        </div>
                    </div>

                    {/* <!-- Sticker-like screenshots --> */}
                    <div class="sticker sticker-1">
                        <img src="https://i.imgur.com/nahIM8p.png" alt="Screenshot of ismy.space" />
                    </div>
                    <div class="sticker sticker-2">
                        <img src="https://i.imgur.com/oQZpsdk.png" alt="Screenshot of ismy.space" />
                    </div>
                </div>

                <div class="container">
                    <div class="content-section">
                        <div class="neo-box">
                            <h2>What is ismy.space?</h2>
                            <p>ismy.space is a simple yet powerful tool that gives you an instant web space at any URL you want.
                                Just go to <strong>ismy.space/ANYTHING</strong> and claim your unique space - no signup required!</p>
                        </div>

                        <div class="neo-box">
                            <h2>Easy to share, easy to remember</h2>
                            <p>One of the best things about ismy.space is how easy it is to share verbally:</p>
                            <ul>
                                <li><strong>Say it out loud</strong> - "Check out ismy dot space slash myname" - no need for complicated URLs</li>
                                <li><strong>Type it easily</strong> - Simple to type without copying and pasting</li>
                                <li><strong>Personal web presence</strong> - Create a space that works like a Neocities page for personal expression</li>
                                <li><strong>Customizable</strong> - Make it your own with HTML, CSS, and markdown to express your style</li>
                            </ul>
                        </div>

                        <div class="neo-box">
                            <h2>How it works</h2>
                            <ol>
                                <li>Visit <strong>ismy.space/</strong> followed by any word you want (e.g., <code>ismy.space/myname</code>)</li>
                                <li>Your space is instantly created</li>
                                <li>Start posting text, links, HTML, or markdown</li>
                                <li>Share your unique URL with anyone</li>
                            </ol>
                        </div>
                        https://i.imgur.com/RFB5WIc.png

                        {/* <!-- Sticker-like screenshots --> */}
                        <div class="sticker sticker-3">
                            <img src=" https://i.imgur.com/RFB5WIc.png" alt="Screenshot of ismy.space" />
                        </div>

                        <div class="neo-box">
                            <h2>Why people love it</h2>
                            <pre>"Everyone who sees this project loves it and I use it almost every day.
                                Just a simple scratch pad that is easy to share when talking."
                                - Creator</pre>
                        </div>

                        <div class="neo-box">
                            <h2>Perfect for:</h2>
                            <ul>
                                <li><strong>Quick sharing</strong> - Instead of spamming friends with multiple links, share one space link</li>
                                <li><strong>Project onboarding</strong> - List requirements and resources without needing accounts or emails</li>
                                <li><strong>Note taking</strong> - Save that password, phone number, or text you need temporarily</li>
                                <li><strong>Idea boards</strong> - Create a collaborative space for brainstorming</li>
                                <li><strong>Link trees</strong> - Make a customizable collection of your important links</li>
                                <li><strong>Device transfer</strong> - Get text from one device to another without installing apps</li>
                            </ul>
                        </div>

                        {/* <!-- Sticker-like screenshots --> */}
                        <div class="sticker sticker-4">
                            <img src="https://i.imgur.com/Fk3YO5o.png" alt="Screenshot of ismy.space" />
                        </div>

                        <div class="neo-box">
                            <h2>Powerful features</h2>
                            <ul>
                                <li>Full <strong>Markdown</strong> and <strong>HTML/CSS</strong> support</li>
                                <li>Optional password protection for read or write access</li>
                                <li>Helpful commands (try typing <code>/help</code> to see them all)</li>
                                <li>Theme customization (try <code>/theme=dark</code> or <code>/theme=light</code>)</li>
                                <li>Extendable with <a href="/addons">addons</a> for additional functionality</li>
                            </ul>
                        </div>

                        <div class="neo-box">
                            <h2>No hassle, just space</h2>
                            <p>Unlike Google Docs or other tools, there's no need to set permissions, create accounts, or deal with complicated
                                sharing settings. For quick, throwaway spaces, just create and share!</p>

                            <p>Ready to try it? Just add a word after the URL and start using your space!</p>
                        </div>
                    </div>
                </div>
                {html`
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const createSpaceButton = document.getElementById('create-space');
        const spaceNameInput = document.getElementById('space-name');

        // Handle button click
        createSpaceButton.addEventListener('click', function() {
            goToSpace();
        });

        // Handle Enter key press
        spaceNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                goToSpace();
            }
        });

        // Function to navigate to the space
        function goToSpace() {
            const spaceName = spaceNameInput.value.trim();
            if (spaceName) {
                window.location.href = '/' + spaceName;
            } else {
                // Add a shake animation if no input
                spaceNameInput.classList.add('shake');
                setTimeout(() => {
                    spaceNameInput.classList.remove('shake');
                }, 500);
                spaceNameInput.focus();
            }
        }


    });
</script>`}
            </>
        </Html>

    )
})
app.get('/guide', async (c) => {

    return c.html(
        <Html title={"Home"} theme={"light"}>
            <>
                {html`
    <style>
        :root {
            --primary: #ff6b6b;
            --secondary: #4ecdc4;
            --accent: #ffe66d;
            --dark: #2d3436;
            --light: #f9f9f9;
            --border-width: 4px;
            --border-radius: 0;
            --font-family: 'Courier New', monospace;
        }

        body {
            font-family: var(--font-family);
            background-color: var(--light);
            color: var(--dark);
            line-height: 1.6;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Header styles */
        header {
            background-color: var(--accent);
            padding: 40px 20px;
            text-align: center;
            border-bottom: var(--border-width) solid black;
            margin-bottom: 40px;
            position: relative;
        }

        header h1 {
            font-size: 3rem;
            margin: 0;
            color: black;
        }

        header p {
            font-size: 1.2rem;
            margin-top: 10px;
        }

        /* Neobrutalist styles */
  
        /* Section headers */
        .section-header {
            background-color: var(--primary);
            color: white;
            padding: 15px;
            margin: -30px -30px 30px -30px;
            border-bottom: var(--border-width) solid black;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .section-header h2 {
            margin: 0;
            font-size: 1.8rem;
        }

        .section-icon {
            font-size: 2rem;
            background-color: white;
            color: var(--primary);
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid black;
        }

        /* Content styling */
        .content-section {
            margin-bottom: 30px;
        }

        .content-section h3 {
            color: var(--primary);
            border-bottom: 3px solid var(--primary);
            padding-bottom: 10px;
            margin-top: 30px;
            font-size: 1.5rem;
        }

        .content-section h4 {
            color: var(--dark);
            margin-top: 25px;
            font-size: 1.3rem;
        }

        /* Code blocks */
        pre,
        code {
            font-family: 'Courier New', monospace;
            background-color: #f1f1f1;
            border: 2px solid #ddd;
            border-radius: 0;
            padding: 2px 5px;
        }

        pre {
            padding: 15px;
            overflow-x: auto;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border: 3px solid black;
        }

        th {
            background-color: var(--secondary);
            color: black;
            text-align: left;
            padding: 12px;
            border: 2px solid black;
        }

        td {
            padding: 12px;
            border: 2px solid black;
            background-color: white;
        }

        /* Example boxes */
        .example-box {
            background-color: var(--accent);
            border: 3px solid black;
            padding: 15px;
            margin: 20px 0;
            position: relative;
        }

        .example-box::before {
            content: "EXAMPLE";
            position: absolute;
            top: -15px;
            left: 10px;
            background-color: black;
            color: var(--accent);
            padding: 5px 10px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        /* Tips */
        .tip-box {
            background-color: var(--secondary);
            border: 3px solid black;
            padding: 15px;
            margin: 20px 0;
            position: relative;
        }

        .tip-box::before {
            content: "PRO TIP";
            position: absolute;
            top: -15px;
            left: 10px;
            background-color: black;
            color: var(--secondary);
            padding: 5px 10px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        /* Command styling */
        .command {
            background-color: black;
            color: white;
            font-family: monospace;
            padding: 10px 15px;
            margin: 10px 0;
            display: inline-block;
        }

        /* Stickers */
      

        .sticker-1 {
            --rotate: -5deg;
            top: -20px;
            right: 30px;
        }

        .sticker-2 {
            --rotate: 3deg;
            bottom: -15px;
            left: 40px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .section-header {
                flex-direction: column;
                text-align: center;
                padding-top: 30px;
            }

            .section-icon {
                margin-top: -45px;
            }
                .flex{
                    display: flex;
                    flex-direction: column;
            }

        
        }
            .flex{
                    display: flex;
            }

        .col{
                display: flex;
    flex-direction: column;
    }
        /* Navigation */
        .guide-nav {
            position: sticky;
            top: 20px;
            background-color: white;
            border: var(--border-width) solid black;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 5px 5px 0 black;
            z-index: 7;
            margin-right: 20px;
        }

        .guide-nav h3 {
            margin-top: 0;
            border-bottom: 2px solid var(--primary);
            padding-bottom: 10px;
        }

        .guide-nav ul {
            list-style-type: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
             
        }

        .guide-nav li {
            margin-bottom: 10px;
            text-align: left;
        }

        .guide-nav a {
            color: var(--dark);
            text-decoration: none;
            display: block;
            padding: 5px 0;
            border-left: 3px solid transparent;
            padding-left: 10px;
        }

        .guide-nav a:hover {
            border-left: 3px solid var(--primary);
            color: var(--primary);
        }

      

        /* Footer */
        footer {
            text-align: center;
            margin-top: 50px;
            padding: 30px;
            background-color: var(--dark);
            color: white;
            border-top: var(--border-width) solid black;
        }
    </style>
    `}

                <header>
                    <h1>ismy.space Guide</h1>
                    <p>Power up your space with these tips and tricks!</p>
                </header>

                <div class="container flex">
                    <div>

                        <nav class="guide-nav col">
                            <h3>Quick Navigation</h3>
                            <ul class="col">
                                <li><a href="#commands">/ Commands</a></li>
                                <li><a href="#links-images">Links and Images</a></li>
                                <li><a href="#html-markdown">HTML & Markdown</a></li>
                                <li><a href="#headings">Headings</a></li>
                                <li><a href="#text-formatting">Text Formatting</a></li>
                                <li><a href="#lists">Lists</a></li>
                                <li><a href="#styles">Styles (HTML Only)</a></li>
                                <li><a href="#css-libraries">CSS Libraries</a></li>
                            </ul>
                        </nav>
                    </div>

                    <div>
                        <div class="neo-box" id="commands">
                            <div class="section-header">
                                <div class="section-icon">/</div>
                                <h2>Commands</h2>
                            </div>
                            <div class="sticker sticker-1">Essential!</div>

                            <div class="content-section">
                                <p>To adjust things that seem out of your control, you can use the / commands.</p>

                                <div class="example-box">
                                    <p>To remove a post, simply type: <span class="command">/remove id=10</span></p>
                                    <p>To get a full list of commands, type: <span class="command">/help</span></p>
                                </div>

                                <div class="tip-box">
                                    <p>Commands are case-sensitive, so make sure to type them exactly as shown.</p>
                                </div>
                            </div>
                        </div>

                        <div class="neo-box" id="links-images">
                            <div class="section-header">
                                <div class="section-icon">🔗</div>
                                <h2>Links and Images</h2>
                            </div>

                            <div class="content-section">
                                <p>Your space supports links and images. To use them, simply paste in the URL and it will be
                                    turned into a link right away.</p>

                                <div class="example-box">
                                    <p>Paste: <code>https://example.com</code></p>
                                    <p>Result: <a href="#">https://example.com</a></p>
                                    <hr />
                                    <p>Paste an image URL: <code>https://example.com/image.jpg</code></p>
                                    <p>Result: The image will display with the URL below it</p>
                                </div>

                                <div class="tip-box">
                                    <p>You can also use HTML or Markdown to create more customized links and images!</p>
                                </div>
                            </div>
                        </div>

                        <div class="neo-box" id="html-markdown">
                            <div class="section-header">
                                <div class="section-icon">&lt;/&gt;</div>
                                <h2>HTML & Markdown</h2>
                            </div>
                            <div class="sticker sticker-2">Powerful!</div>

                            <div class="content-section">
                                <p>All spaces support HTML & Markdown. This lets you get the bones of your space the way you
                                    want them.</p>

                                <h3 id="headings">Headings</h3>
                                <p>To create a heading, add number signs (#) in front of a word or phrase. The number of number
                                    signs you use should correspond to the heading level.</p>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Markdown</th>
                                            <th>HTML</th>
                                            <th>Rendered Output</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code># Heading level 1</code></td>
                                            <td><code>&lt;h1&gt;Heading level 1&lt;/h1&gt;</code></td>
                                            <td>
                                                <h1 style="margin:0;font-size:2em;">Heading level 1</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><code>## Heading level 2</code></td>
                                            <td><code>&lt;h2&gt;Heading level 2&lt;/h2&gt;</code></td>
                                            <td>
                                                <h2 style="margin:0;font-size:1.8em;">Heading level 2</h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><code>### Heading level 3</code></td>
                                            <td><code>&lt;h3&gt;Heading level 3&lt;/h3&gt;</code></td>
                                            <td>
                                                <h3 style="margin:0;font-size:1.5em;">Heading level 3</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><code>#### Heading level 4</code></td>
                                            <td><code>&lt;h4&gt;Heading level 4&lt;/h4&gt;</code></td>
                                            <td>
                                                <h4 style="margin:0;font-size:1.3em;">Heading level 4</h4>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><code>##### Heading level 5</code></td>
                                            <td><code>&lt;h5&gt;Heading level 5&lt;/h5&gt;</code></td>
                                            <td>
                                                <h5 style="margin:0;font-size:1.1em;">Heading level 5</h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><code>###### Heading level 6</code></td>
                                            <td><code>&lt;h6&gt;Heading level 6&lt;/h6&gt;</code></td>
                                            <td>
                                                <h6 style="margin:0;font-size:1em;">Heading level 6</h6>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3 id="text-formatting">Text Formatting</h3>

                                <h4>Bold</h4>
                                <p>To bold text, add two asterisks or underscores before and after a word or phrase.</p>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Markdown</th>
                                            <th>HTML</th>
                                            <th>Rendered Output</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code>I just love **bold text**.</code></td>
                                            <td><code>I just love &lt;strong&gt;bold text&lt;/strong&gt;.</code></td>
                                            <td>I just love <strong>bold text</strong>.</td>
                                        </tr>
                                        <tr>
                                            <td><code>I just love __bold text__.</code></td>
                                            <td><code>I just love &lt;strong&gt;bold text&lt;/strong&gt;.</code></td>
                                            <td>I just love <strong>bold text</strong>.</td>
                                        </tr>
                                        <tr>
                                            <td><code>Love**is**bold</code></td>
                                            <td><code>Love&lt;strong&gt;is&lt;/strong&gt;bold</code></td>
                                            <td>Love<strong>is</strong>bold</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h4>Italic</h4>
                                <p>To italicize text, add one asterisk or underscore before and after a word or phrase.</p>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Markdown</th>
                                            <th>HTML</th>
                                            <th>Rendered Output</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code>Italicized text is the *cat's meow*.</code></td>
                                            <td><code>Italicized text is the &lt;em&gt;cat's meow&lt;/em&gt;.</code></td>
                                            <td>Italicized text is the <em>cat's meow</em>.</td>
                                        </tr>
                                        <tr>
                                            <td><code>Italicized text is the _cat's meow_.</code></td>
                                            <td><code>Italicized text is the &lt;em&gt;cat's meow&lt;/em&gt;.</code></td>
                                            <td>Italicized text is the <em>cat's meow</em>.</td>
                                        </tr>
                                        <tr>
                                            <td><code>A*cat*meow</code></td>
                                            <td><code>A&lt;em&gt;cat&lt;/em&gt;meow</code></td>
                                            <td>A<em>cat</em>meow</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3 id="lists">Lists</h3>
                                <p>To create an unordered list, add dashes (-), asterisks (*), or plus signs (+) in front of
                                    line items. Indent one or more items to create a nested list.</p>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Markdown</th>
                                            <th>HTML</th>
                                            <th>Rendered Output</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <code>
                                                    1. First item<br />
                                                    2. Second item<br />
                                                    3. Third item<br />
                                                    4. Fourth item
                                                </code>
                                            </td>
                                            <td>
                                                <code>
                                                    &lt;ol&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;First item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Second item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Third item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Fourth item&lt;/li&gt;<br />
                                                    &lt;/ol&gt;
                                                </code>
                                            </td>
                                            <td>
                                                <ol>
                                                    <li>First item</li>
                                                    <li>Second item</li>
                                                    <li>Third item</li>
                                                    <li>Fourth item</li>
                                                </ol>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <code>
                                                    * First item<br />
                                                    * Second item<br />
                                                    * Third item<br />
                                                    * Fourth item
                                                </code>
                                            </td>
                                            <td>
                                                <code>
                                                    &lt;ul&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;First item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Second item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Third item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Fourth item&lt;/li&gt;<br />
                                                    &lt;/ul&gt;
                                                </code>
                                            </td>
                                            <td>
                                                <ul>
                                                    <li>First item</li>
                                                    <li>Second item</li>
                                                    <li>Third item</li>
                                                    <li>Fourth item</li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <code>
                                                    - First item<br />
                                                    - Second item<br />
                                                    - Third item<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;- Indented item<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;- Indented item<br />
                                                    - Fourth item
                                                </code>
                                            </td>
                                            <td>
                                                <code>
                                                    &lt;ul&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;First item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Second item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Third item<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;ul&gt;<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;Indented item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;Indented item&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/ul&gt;<br />
                                                    &nbsp;&nbsp;&lt;/li&gt;<br />
                                                    &nbsp;&nbsp;&lt;li&gt;Fourth item&lt;/li&gt;<br />
                                                    &lt;/ul&gt;
                                                </code>
                                            </td>
                                            <td>
                                                <ul>
                                                    <li>First item</li>
                                                    <li>Second item</li>
                                                    <li>Third item
                                                        <ul>
                                                            <li>Indented item</li>
                                                            <li>Indented item</li>
                                                        </ul>
                                                    </li>
                                                    <li>Fourth item</li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3 id="styles">Styles (HTML Only)</h3>
                                <p>Styles are a huge subject, but here is just enough to make you productive.</p>
                                <p>The style tag is a special HTML tag that lets you change how things look:</p>

                                <pre><code>&lt;style&gt; h2{`{color:red;}`}&lt;/style&gt;</code></pre>

                                <h4>Text Color</h4>
                                <pre><code>&lt;style&gt; h2{`{color:red;}`}&lt;/style&gt;</code></pre>
                                <div class="example-box">
                                    <h2 style="color:red;margin:0;">This heading would be red</h2>
                                </div>

                                <h4>Background Color</h4>
                                <pre><code>&lt;style&gt; h2{`{background-color:red;}`}&lt;/style&gt;</code></pre>
                                <div class="example-box">
                                    <h2 style="background-color:red;color:white;margin:0;">This heading would have a red
                                        background</h2>
                                </div>

                                <h4>Text Alignment</h4>
                                <pre><code>&lt;style&gt; h2{`{text-align:center;}`}&lt;/style&gt;</code></pre>
                                <div class="example-box">
                                    <h2 style="text-align:center;margin:0;">This heading would be centered</h2>
                                </div>

                                <h4>Font Family</h4>
                                <pre><code>&lt;style&gt; h2{`{font-family:Arial;}`}&lt;/style&gt;</code></pre>
                                <div class="example-box">
                                    <h2 style="font-family:Arial,sans-serif;margin:0;">This heading would use Arial font</h2>
                                </div>

                                <h4>Font Size</h4>
                                <pre><code>&lt;style&gt; h2{`{font-size:16px;}`}&lt;/style&gt;</code></pre>
                                <div class="example-box">
                                    <h2 style="font-size:16px;margin:0;">This heading would be 16px in size</h2>
                                </div>

                                <h3 id="css-libraries">CSS Libraries</h3>
                                <p>You can also include CSS libraries and just use the classes from your HTML, whether that's
                                    Bootstrap or any other library.</p>

                                <h4>Bootstrap Example</h4>
                                <pre><code>&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"&gt;</code></pre>

                                <div class="tip-box">
                                    <p><strong>Note:</strong> Any JavaScript libraries need to be added as an addon because
                                        script tags are not allowed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer>
                    <p>© 2023 ismy.space - Your Instant Sharable Space</p>
                    <p>Made with ❤️ for the web</p>
                </footer>

                {
                    html`
    <script>
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

      
    </script>
    `
                }



            </>
        </Html>

    )
})
app.get('/*', async (c) => {
    const rawpageData = await get(c.env.DB, c.req.path)
    const messages = await handleMessages(rawpageData.messages)
    const pageData = { ...rawpageData, messages }
    return c.html(
        <Content pageData={pageData as unknown as PageData} />)
})

app.post('/:path/read-pw',
    zValidator(
        'form',
        z.object({
            readPw: z.string(),
        })),
    async (c) => {
        const { readPw } = c.req.valid('form')
        const path = `/${c.req.param('path')}`

        try {
            const rawpageData = await get(c.env.DB, path)
            if (rawpageData.readPw === readPw) {
                const messages = await handleMessages(rawpageData.messages)
                return c.html(
                    <Messages messages={messages} readPw={rawpageData.readPw} />
                )
            } else {
                throw new Error('Wrong Password')
            }

        } catch (e) {
            return c.html(
                <ReadPw route={path} message='Wrong Password try again' />
            )
        }

    })

app.post('/:path/set-pw',
    zValidator(
        'form',
        z.object({
            readPw: z.string(),
            writePw: z.string()
        })),
    async (c) => {
        const { readPw, writePw } = c.req.valid('form')
        const path = `/${c.req.param('path')}`
        console.log(path)
        // TODO: check if page already has a pw set if
        try {
            await SetPW(c.env.DB, path, writePw, readPw)
        } catch (e) {
            return c.html(
                <div id="messages">
                    <h2> Password was alredy set</h2>
                </div>
            )
        }
        return c.html(
            <>
                <div id="messages">
                </div>
                <Input
                    route={path}
                    wrightPw={writePw !== null && writePw !== ""}
                />
            </>
        )
    })


app.post('/*',
    zValidator(
        'form',
        z.object({
            message: z.string().min(1),
            writePw: z.string().optional()
        })),
    async (c) => {
        const { message, writePw } = c.req.valid('form')
        const rawpageData = await get(c.env.DB, c.req.path)
        if (rawpageData.writePw && rawpageData.writePw !== writePw) {
            return c.html(
                <p>
                    page is write protected
                </p>
            )
        } else {
            const rpcResult = await rpc(c.env.DB, c.req.path, message, writePw)
            if (rpcResult) {
                const msg = await handleMessages([rpcResult])
                return c.html(<Message message={msg[0]} index={0} />)
            } else {
                try {
                    await update(c.env.DB, c.req.path, message, writePw)
                } catch (error) {
                    return c.html(
                        <p>
                            page is write protected
                        </p>
                    )
                }

                const msg = await handleMessages([message])
                return c.html(<Message message={msg[0]} index={0} />)
            }
        }
    })



export default app
