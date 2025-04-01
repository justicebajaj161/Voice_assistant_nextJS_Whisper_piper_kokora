import AudioRecorder from '../components/AudioRecorder';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ashley AI Voice Assistant
          </h1>
          <p className="text-lg text-base-content/80">
            Natural conversations with AI through voice
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-4 md:p-6">
              <AudioRecorder />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl">How It Works</h2>
                <ul className="space-y-3 mt-2">
                  <li className="flex items-start gap-3">
                    <div className="badge badge-primary mt-1">1</div>
                    <span>Tap the mic and speak naturally</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="badge badge-primary mt-1">2</div>
                    <span>Your voice is converted to text</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="badge badge-primary mt-1">3</div>
                    <span>AI generates a thoughtful response</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="badge badge-primary mt-1">4</div>
                    <span>Hear the response in natural speech</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl">Features</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="badge badge-primary gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" x2="12" y1="19" y2="22"></line>
                    </svg>
                    Voice Chat
                  </div>
                  <div className="badge badge-secondary gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                      <path d="M12 2v2"></path>
                      <path d="M12 22v-2"></path>
                      <path d="m17 20.66-1-1.73"></path>
                      <path d="M11 10.27 7 3.34"></path>
                      <path d="m20.66 17-1.73-1"></path>
                      <path d="m3.34 7 1.73 1"></path>
                      <path d="M14 12h8"></path>
                      <path d="M2 12h2"></path>
                      <path d="m20.66 7-1.73 1"></path>
                      <path d="m3.34 17 1.73-1"></path>
                      <path d="m7 20.66 1-1.73"></path>
                      <path d="m11 13.73-4 6.93"></path>
                    </svg>
                    AI-Powered
                  </div>
                  <div className="badge badge-accent gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0"></path>
                      <path d="M2 12c0 5.523 4.477 10 10 10"></path>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Real-time
                  </div>
                  <div className="badge badge-neutral gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Private
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}