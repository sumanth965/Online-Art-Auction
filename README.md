<h1 align="center">🎨 Online Art Auction System</h1>
<h3 align="center">MongoDB-Based Web Application | MERN Project</h3>

<p align="center">
  An <b>Online Art Auction Platform</b> where artists upload artworks for auction
  and buyers place competitive bids. The system tracks bids, determines winners,
  and manages sold or unsold artworks using a MongoDB-driven backend.
</p>

<p align="center">
  🔗 <strong>Live Demo:</strong>
  <a href="https://online-art-auction.vercel.app/" target="_blank">
    https://online-art-auction.vercel.app/
  </a>
  <br/>
  📁 <strong>GitHub Repository:</strong>
  <a href="https://github.com/sumanth965/Online-Art-Auction.git" target="_blank">
    https://github.com/sumanth965/Online-Art-Auction.git
  </a>
</p>

<hr/>

<h2>📌 Academic Context</h2>

<p>
<b>Course:</b> MongoDB Projects (C Section) <br/>
<b>Objective:</b> Design a MongoDB schema, prepare a schema diagram (ER-equivalent),
and implement a simple UI to interact with the system.
</p>

<p>
<b>Submission Window:</b> <br/>
🗓 <b>November 10, 2025 – November 15, 2025</b>
</p>

<hr/>

<h2>🖼 Online Art Auction – Description</h2>

<ul>
  <li>Artists upload artworks for auction</li>
  <li>Each artwork has a title, category, base price, and artist</li>
  <li>Buyers place bids on artworks</li>
  <li>The highest bid wins the auction</li>
  <li>Artworks can be marked as <b>sold</b> or <b>unsold</b></li>
  <li>Auctions maintain bid history, dates, and winning buyers</li>
</ul>

<hr/>

<h2>🧠 MongoDB Collections</h2>

<ul>
  <li><b>artists</b></li>
  <li><b>artworks</b></li>
  <li><b>bids</b></li>
  <li><b>buyers</b></li>
</ul>

<h3>📋 Key Attributes</h3>

<ul>
  <li>artworkTitle</li>
  <li>category</li>
  <li>artistName</li>
  <li>basePrice</li>
  <li>bidAmount</li>
  <li>buyerName</li>
  <li>soldStatus</li>
</ul>

<hr/>

<h2>🗂 MongoDB Schema Design (Logical)</h2>

<pre>
Artists
- _id
- artistName
- email
- artworks[]

Artworks
- _id
- artworkTitle
- category
- basePrice
- artistId
- soldStatus

Buyers
- _id
- buyerName
- email

Bids
- _id
- artworkId
- buyerId
- bidAmount
- bidDate
</pre>

<p>
This schema follows a <b>normalized MongoDB design</b> with references to efficiently
handle auctions, bidding history, and analytics queries.
</p>

<hr/>

<h2>📊 MongoDB Queries Implemented</h2>

<ul>
  <li>List artworks sold above ₹1,00,000</li>
  <li>Find artists whose artworks were unsold</li>
  <li>Show bidders who won multiple auctions</li>
  <li>Calculate average bid per artwork</li>
  <li>Retrieve artworks bid on by 5 or more users</li>
  <li>Identify highest bid artwork in each category</li>
  <li>Show auctions where no bids were placed</li>
  <li>Find artists featured in multiple auctions</li>
  <li>Retrieve top 3 bidders by total spending</li>
  <li>List categories with the highest number of artworks</li>
</ul>

<hr/>

<h2>💻 User Interface (UI)</h2>

<h3>👤 Buyer Dashboard</h3>
<ul>
  <li>Browse artworks by category</li>
  <li>View current highest bids</li>
  <li>Track auctions participated in</li>
</ul>

<h3>💰 Bid Page</h3>
<ul>
  <li>Place bids in real time</li>
  <li>View bidding history</li>
  <li>Highest bid highlighting</li>
</ul>

<h3>🎨 Artist Panel</h3>
<ul>
  <li>Upload new artworks</li>
  <li>View auction status</li>
  <li>Track sold / unsold artworks</li>
</ul>

<hr/>

<h2>🧠 Tech Stack</h2>

<table>
  <tr>
    <th align="left">Layer</th>
    <th align="left">Technology</th>
  </tr>
  <tr>
    <td>Frontend</td>
    <td>React.js, HTML, CSS</td>
  </tr>
  <tr>
    <td>Backend</td>
    <td>Node.js, Express.js</td>
  </tr>
  <tr>
    <td>Database</td>
    <td>MongoDB</td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>Vercel</td>
  </tr>
</table>

<hr/>

<h2>📁 Project Structure</h2>

<pre>
Online-Art-Auction/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
└── README.md
</pre>

<hr/>

<h2>📜 License</h2>
<p>This project is developed for <b>academic purposes</b> and is licensed under the MIT License.</p>

<hr/>

<h2>👨‍💻 Author</h2>

<p>
<b>Sumanth</b><br/>
GitHub:
<a href="https://github.com/sumanth965" target="_blank">
  https://github.com/sumanth965
</a>
</p>

<hr/>

<p align="center">
  ⭐ If you like this project, don’t forget to give it a star!
</p>
