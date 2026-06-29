import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public')
    const tarPath = join(publicDir, 'portfolio-project.tar.gz')

    if (!existsSync(tarPath)) {
      execSync(
        `cd ${process.cwd()} && tar czf ${tarPath} --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='dev.log' --exclude='server.log' --exclude='upload' --exclude='*.db' --exclude='*.db-journal' --exclude='skills' --exclude='mini-services' --exclude='examples' .`
      )
    }

    const fs = await import('fs/promises')
    const fileBuffer = await fs.readFile(tarPath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Disposition': 'attachment; filename="portfolio-project.tar.gz"',
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}