"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <span className="text-sm text-muted-foreground">© {currentYear} Mao.Ai. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
