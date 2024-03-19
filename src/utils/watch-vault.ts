const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs').promises

const VAULT = '/Users/vojta/Documents/obsidian-vault'
const DESTINATION = path.join(process.cwd(), 'public', 'vault')

// Initialize watcher.
const watcher = chokidar.watch(VAULT, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
})

// Something to do when any file is added or changed.
const log = console.log.bind(console)

watcher
  .on('add', async (path: string) => {
    log(`File ${path} has been added`)
    await copyVault(VAULT, DESTINATION)
  })
  .on('change', async (path: string) => {
    log(`File ${path} has been changed`)
    await copyVault(VAULT, DESTINATION)
  })

async function copyVault(sourceDir: string, destinationDir: string) {
  await fs.mkdir(destinationDir, { recursive: true })

  const filesToCopy = await fs.readdir(sourceDir, { withFileTypes: true })

  await Promise.all(
    filesToCopy.map(async (file: any) => {
      const sourceFile = path.join(sourceDir, file.name)
      const destinationFile = path.join(destinationDir, file.name)

      if (file.isDirectory()) {
        return copyVault(sourceFile, destinationFile)
      } else {
        return fs.copyFile(sourceFile, destinationFile)
      }
    })
  )
}
