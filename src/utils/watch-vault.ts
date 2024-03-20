const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs-extra')

const VAULT = '/Users/vojta/Documents/obsidian-vault'
const DESTINATION = path.join(process.cwd(), 'public', 'vault')

// Initialize watcher.
const watcher = chokidar.watch(VAULT, {
  ignored: [/(^|[\/\\])\../, '**/Untitled.md'], // ignore dotfiles and Untitled.md
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
  .on('unlink', async (path: string) => {
    log(`File ${path} has been removed`)
    try {
      log('unlinking')
      await copyVault(VAULT, DESTINATION)
    } catch (error) {
      console.error('Error copying vault:', error)
    }
  })
  .on('addDir', async (path: string) => {
    log(`Directory ${path} has been added`)
    await copyVault(VAULT, DESTINATION)
  })
  .on('unlinkDir', async (path: string) => {
    log(`Directory ${path} has been removed`)
    await copyVault(VAULT, DESTINATION)
  })

async function copyVault(sourceDir: string, destinationDir: string) {
  // Remove the entire destination directory
  try {
    await fs.remove(destinationDir)
  } catch (error) {
    // log('Error removing directory:', error)
  }

  // Copy the entire source directory to the destination directory
  try {
    await fs.copy(sourceDir, destinationDir)
  } catch (error) {
    // log('Error copying directory:', error)
  }
}
