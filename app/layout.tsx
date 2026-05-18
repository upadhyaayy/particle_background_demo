export const metadata = {
  title: "ParticleBackground — React Component",
  description: "Drop-in animated particle system for React and Next.js.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}