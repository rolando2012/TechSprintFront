export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="min-h-screen w-full py-8 bg-background-reg flex justify-center">
        <div className="w-full max-w-4xl bg-gray-100 shadow-md px-4 sm:px-6 py-6 mb-6 rounded-2xl">
        
          {children}
        </div>
      </main>
    );
  }