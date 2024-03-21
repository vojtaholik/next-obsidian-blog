const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs-extra')

const VAULT = '/Users/vojta/Documents/obsidian-vault'
const DESTINATION = path.join(process.cwd(), 'vault')
const IMAGES_DESTINATION = path.join(process.cwd(), 'public', 'images')
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
    if (path.endsWith('.png') || path.endsWith('.jpg')) {
      await copyImageAssets(path, IMAGES_DESTINATION)
    }
    await copyVault(VAULT, DESTINATION)
  })
  .on('change', async (path: string) => {
    if (path.endsWith('.png') || path.endsWith('.jpg')) {
      await copyImageAssets(path, IMAGES_DESTINATION)
    }
    log(`File ${path} has been changed`)
    await copyVault(VAULT, DESTINATION)
  })
  .on('unlink', async (path: string) => {
    log(`File ${path} has been removed`)
    try {
      if (path.endsWith('.png') || path.endsWith('.jpg')) {
        await removeImageAsset(path, IMAGES_DESTINATION)
      }
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

async function copyImageAssets(sourcePath: string, destinationDir: string) {
  const filename = path.basename(sourcePath)
  const destinationPath = path.join(destinationDir, filename)

  try {
    await fs.copy(sourcePath, destinationPath)
  } catch (error) {
    console.error('Error copying image assets:', error)
  }
}

async function removeImageAsset(sourcePath: string, destinationDir: string) {
  const filename = path.basename(sourcePath)
  const destinationPath = path.join(destinationDir, filename)

  try {
    await fs.remove(destinationPath)
  } catch (error) {
    console.error('Error removing image assets:', error)
  }
}

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
    await removeImagesFromVault()
  } catch (error) {
    // log('Error copying directory:', error)
  }
}

async function removeImagesFromVault() {
  try {
    // because we're moving them over to the public/images directory
    // we can remove them from the destination directory
    const files = await fs.readdir(DESTINATION)
    const imageFiles = files.filter((file: string) => {
      return file.endsWith('.png') || file.endsWith('.jpg')
    })
    await Promise.all(
      imageFiles.map(async (file: string) => {
        const filePath = path.join(DESTINATION, file)
        await fs.remove(filePath)

        log(`File ${filePath} has been removed`)
      })
    )
  } catch (error) {
    console.error('Error removing image assets:', error)
  }
}
