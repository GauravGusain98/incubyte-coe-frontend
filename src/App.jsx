import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-4xl font-heading text-brand">Hello Tailwind + Vite!</h1>
      <button
        className="mt-4 px-4 py-2 bg-brand text-white rounded"
        onClick={() => document.documentElement.classList.toggle('dark')}
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}

export default App
