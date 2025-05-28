const Home = () => {
  return (
    <main className="flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <h2 data-testid="welcomeMessage" className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Home Page</h2>
        <p data-testid="successMessage" className="text-gray-600 mb-6">You're successfully logged in.</p>
      </div>
    </main>
  );
};

export default Home;
