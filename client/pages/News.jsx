import React, { useState, useEffect } from 'react';

// --- Icon Components ---
const Droplets = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.7-3.02C8.23 8.5 7 9.82 7 11.5c0 .96.78 1.75 1.75 1.75"/>
    <path d="M10.41 9.92a2.2 2.2 0 0 0-1.44 3.2.5.5 0 0 1-.36.36c-1.3.56-2.61.03-3.2-1.12-1.24-2.4-1.03-5.3.5-7.4C7 3.82 8.7 3 10.5 3c2.7 0 5.2 2.7 5.5 5.5.3 2.4-1.1 4.5-3.1 5.5"/>
  </svg>
);
const Calendar = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y2="2"/><line x1="8" x2="8" y2="2"/><line x1="3" x2="21" y1="10"/></svg>
);
const User = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const Tag = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
);
const Search = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const ArrowLeft = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);


// --- Sample Data ---
const articles = [
    {
        id: 1,
        title: "The Silent Crisis: How Urban Pollution is Choking the Mithi River",
        excerpt: "Once a vital lifeline for Mumbai, the Mithi River is now a symbol of urban neglect. This in-depth report explores the primary sources of pollution and the urgent need for intervention.",
        imageUrl: "https://placehold.co/1200x600/34495e/ffffff?text=Mithi+River+Crisis",
        author: "Dr. Anjali Sharma",
        date: "2025-10-08",
        category: "Scientific Findings",
        content: `
            <p>The Mithi River, a confluence of tail-water discharges of the Powai and Vihar lakes, has a story that mirrors Mumbai's own rapid, often unregulated, urban expansion. Spanning approximately 18 kilometers, it meets the Arabian Sea at Mahim Creek, but its journey is fraught with peril. Decades of industrial effluent, untreated sewage, and solid waste dumping have transformed this once-thriving ecosystem into one of the most polluted rivers in India.</p>
            <p>Our recent studies, conducted over a 12-month period, reveal alarming levels of heavy metals such as lead, mercury, and cadmium, particularly near industrial zones. These contaminants not only decimate aquatic life but also pose significant health risks to the dense human populations living along the riverbanks. The Dissolved Oxygen (DO) levels were found to be critically low, often below 2 mg/L, which is insufficient to support most fish species.</p>
            <h3 class="text-2xl font-bold mt-6 mb-3">The Path Forward</h3>
            <p>Addressing this crisis requires a multi-pronged approach. Stricter enforcement of industrial discharge norms, investment in decentralized sewage treatment plants, and a city-wide campaign to curb plastic waste are critical first steps. Community participation is not just desirable; it is essential. The health of the Mithi is intrinsically linked to the health of Mumbai.</p>
        `,
    },
    {
        id: 2,
        title: "Community Power: The Heroes of the Mahim Causeway Cleanup",
        excerpt: "Meet the volunteers who are turning the tide against pollution. A heartwarming look at a recent cleanup drive and the incredible impact of citizen action.",
        imageUrl: "https://placehold.co/600x400/27ae60/ffffff?text=Community+Spotlight",
        author: "Rohan Desai",
        date: "2025-09-15",
        category: "Community Spotlight",
        content: "<p>On a bright Saturday morning, while most of Mumbai was still waking up, a group of over 100 dedicated citizens gathered at the Mahim Causeway. Armed with gloves, garbage bags, and an unwavering spirit, they embarked on a mission: to reclaim a small patch of their city from the clutches of plastic waste. This is the story of their success and a testament to the power of community.</p>",
    },
    {
        id: 3,
        title: "5 Simple Ways You Can Help Save the Mithi River From Home",
        excerpt: "Think you can't make a difference? Think again. Here are five practical, easy-to-implement tips for every Mumbaikar to contribute to the river's restoration.",
        imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Conservation+Tips",
        author: "Priya Mehta",
        date: "2025-09-02",
        category: "Conservation Tips",
        content: "<p>Saving a river as large and complex as the Mithi can feel like an overwhelming task, but the journey of a thousand miles begins with a single step. Here are five simple actions you can take in your daily life to be part of the solution: 1. Segregate your waste. 2. Reduce single-use plastics. 3. Conserve water. 4. Dispose of chemicals responsibly. 5. Spread awareness.</p>",
    },
    {
        id: 4,
        title: "New Policy Announced: BMC to Install 20 New Real-Time Water Quality Sensors",
        excerpt: "In a landmark move, the Brihanmumbai Municipal Corporation has approved a project to install state-of-the-art monitoring sensors along the Mithi River.",
        imageUrl: "https://placehold.co/600x400/f39c12/ffffff?text=Event+News",
        author: "Civic Reporter",
        date: "2025-10-01",
        category: "Event News",
        content: "<p>The BMC has taken a significant step towards data-driven environmental governance. The new sensors will provide real-time data on key parameters like pH, turbidity, and dissolved oxygen, which will be accessible to the public through a dedicated portal. This initiative promises to bring much-needed transparency and accountability to the river's restoration efforts.</p>",
    },
];

const featuredArticle = articles[0];
const otherArticles = articles.slice(1);
const categories = ["All", ...new Set(articles.map(a => a.category))];

// --- Reusable Components ---
function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 left-0 right-0 z-50 border-b border-gray-200/70">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <Droplets className="h-8 w-8 text-blue-600" />
                        <div>
                            <span className="text-xl font-bold text-gray-800">Mithi River Guardian</span>
                            <p className="text-xs text-gray-500">Blog & News</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Mithi River Guardian. All rights reserved.</p>
            </div>
        </footer>
    );
}

// --- Page View Components ---
function BlogListView({ articles, onArticleSelect, onSearch, onFilter }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleFilter = (category) => {
        setActiveCategory(category);
        onFilter(category);
    };

    return (
        <>
            {/* Featured Article */}
            <section className="bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <p className="text-blue-600 font-semibold">{featuredArticle.category}</p>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">{featuredArticle.title}</h1>
                            <p className="mt-4 text-lg text-gray-600">{featuredArticle.excerpt}</p>
                             <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                                <span className="flex items-center"><User className="w-4 h-4 mr-1.5"/>{featuredArticle.author}</span>
                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5"/>{new Date(featuredArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <button onClick={() => onArticleSelect(featuredArticle)} className="mt-6 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition">
                                Read Full Article
                            </button>
                        </div>
                        <div className="order-1 lg:order-2">
                             <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="rounded-2xl shadow-xl object-cover w-full h-full"/>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Filter and Search */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-1/3">
                        <input type="text" placeholder="Search articles..." value={searchTerm} onChange={handleSearch} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => handleFilter(cat)} className={`px-4 py-2 text-sm font-medium rounded-full transition ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                 </div>
            </section>

            {/* Article Grid */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map(article => (
                        <div key={article.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col group border border-gray-200/80">
                            <img src={article.imageUrl} alt={article.title} className="h-56 w-full object-cover"/>
                            <div className="p-6 flex flex-col flex-grow">
                                <div>
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{article.category}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mt-3">{article.title}</h3>
                                <p className="mt-2 text-gray-600 text-sm flex-grow">{article.excerpt}</p>
                                <button onClick={() => onArticleSelect(article)} className="mt-4 text-blue-600 font-semibold self-start hover:text-blue-800 transition">
                                    Read more &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function ArticleDetailView({ article, onBack }) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
            <button onClick={onBack} className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 mb-8">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to All Articles
            </button>
            <div className="max-w-4xl mx-auto">
                <span className="text-base font-semibold text-blue-600">{article.category}</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">{article.title}</h1>
                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4 border-b pb-4 mb-8">
                    <span className="flex items-center"><User className="w-4 h-4 mr-1.5"/>{article.author}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5"/>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <img src={article.imageUrl.replace('600x400', '1200x600')} alt={article.title} className="rounded-2xl shadow-xl w-full object-cover mb-8"/>
                
                <article className="prose lg:prose-xl max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: article.content }}></article>
            </div>
        </div>
    );
}

// --- Main App Component ---
export default function BlogNewsPage() {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [filteredArticles, setFilteredArticles] = useState(otherArticles);

    const handleSearch = (term) => {
        const lowercasedTerm = term.toLowerCase();
        const results = otherArticles.filter(article => 
            article.title.toLowerCase().includes(lowercasedTerm) ||
            article.excerpt.toLowerCase().includes(lowercasedTerm) ||
            article.author.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredArticles(results);
    };

    const handleFilter = (category) => {
        if (category === "All") {
            setFilteredArticles(otherArticles);
        } else {
            const results = otherArticles.filter(article => article.category === category);
            setFilteredArticles(results);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Header />
            <main>
                {selectedArticle ? (
                    <ArticleDetailView article={selectedArticle} onBack={() => setSelectedArticle(null)} />
                ) : (
                    <BlogListView 
                        articles={filteredArticles} 
                        onArticleSelect={setSelectedArticle}
                        onSearch={handleSearch}
                        onFilter={handleFilter}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}