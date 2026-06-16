<?php
/**
 * fix_changelog_links.php
 * 
 * Recursively scans all index.html files and fixes changelog navigation links
 * based on the file's depth from the root directory.
 * 
 * Run this script from the root folder of your project.
 * 
 * Usage (terminal): php fix_changelog_links.php
 * Or access via browser: http://yourdomain.com/fix_changelog_links.php
 */

// Set to true for verbose output (recommended)
define('VERBOSE', true);

// Root directory (current directory where this script is placed)
$rootDir = __DIR__;

// Patterns to look for in navigation links
// We'll replace any changelog link that doesn't match the correct depth
$patterns = [
    // Pattern 1: href="../changelog/" (from wiki/plants/plantname/ - should be ../../../changelog/)
    // Pattern 2: href="../../changelog/" (from wiki/plants/ - should be ../../changelog/ - this is correct)
    // Pattern 3: href="./changelog/" (from root - should be ./changelog/ - this is correct)
    // Pattern 4: href="changelog/" (from root - should be changelog/ - this is correct)
];

/**
 * Recursively scan directory for index.html files
 */
function scanIndexFiles($dir) {
    $results = [];
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $item;
        if (is_dir($path)) {
            // Skip certain directories
            if (in_array($item, ['img', 'images', 'css', 'js', 'javascript', 'vendor', 'node_modules'])) {
                continue;
            }
            $results = array_merge($results, scanIndexFiles($path));
        } elseif ($item === 'index.html') {
            $results[] = $path;
        }
    }
    return $results;
}

/**
 * Calculate depth from root based on directory separators
 */
function getDepth($filePath, $rootDir) {
    $relative = str_replace($rootDir, '', $filePath);
    $relative = ltrim($relative, DIRECTORY_SEPARATOR);
    $parts = explode(DIRECTORY_SEPARATOR, $relative);
    // Remove the filename (index.html) from count
    return count($parts) - 1;
}

/**
 * Generate the correct changelog link based on depth
 */
function getChangelogLink($depth) {
    if ($depth === 0) {
        return './changelog/';
    } else {
        return str_repeat('../', $depth) . 'changelog/';
    }
}

/**
 * Fix changelog links in a file
 */
function fixChangelogLinks($filePath, $rootDir, $verbose = true) {
    $depth = getDepth($filePath, $rootDir);
    $correctLink = getChangelogLink($depth);
    
    // Read the file
    $content = file_get_contents($filePath);
    if ($content === false) {
        echo "❌ Failed to read: $filePath\n";
        return false;
    }
    
    $originalContent = $content;
    $changes = 0;
    
    // Pattern to find changelog links in href attributes
    // This matches: href="anything/changelog/" or href="changelog/" with various prefixes
    $pattern = '/href="([^"]*changelog\/)"/i';
    
    $content = preg_replace_callback($pattern, function($matches) use ($correctLink, &$changes) {
        $oldLink = $matches[1];
        // If the link is already correct, skip it
        if ($oldLink === $correctLink) {
            return $matches[0]; // no change
        }
        $changes++;
        return 'href="' . $correctLink . '"';
    }, $content);
    
    // Also check for old incorrect patterns specifically
    // Some may have ../changelog/ at wrong depth
    $patternsToFix = [
        '/href="\.\.\/changelog\/"/i' => 'href="' . $correctLink . '"',
        '/href="\.\.\/\.\.\/changelog\/"/i' => 'href="' . $correctLink . '"',
        '/href="\.\.\/\.\.\/\.\.\/changelog\/"/i' => 'href="' . $correctLink . '"',
        '/href="\.\.\/\.\.\/\.\.\/\.\.\/changelog\/"/i' => 'href="' . $correctLink . '"',
    ];
    
    foreach ($patternsToFix as $pattern => $replacement) {
        if (preg_match($pattern, $content)) {
            $content = preg_replace($pattern, $replacement, $content);
            $changes++;
        }
    }
    
    // If content changed, write it back
    if ($content !== $originalContent) {
        file_put_contents($filePath, $content);
        if ($verbose) {
            $relativePath = str_replace($rootDir, '', $filePath);
            echo "✅ Fixed: $relativePath (depth: $depth, link: $correctLink, changes: $changes)\n";
        }
        return true;
    } else {
        if ($verbose) {
            $relativePath = str_replace($rootDir, '', $filePath);
            echo "⏭️  No change needed: $relativePath (depth: $depth, link already correct: $correctLink)\n";
        }
        return false;
    }
}

// ---- Main execution ----
echo "🔍 Scanning for index.html files...\n";
$files = scanIndexFiles($rootDir);
echo "📁 Found " . count($files) . " index.html files.\n\n";

$fixed = 0;
$skipped = 0;

foreach ($files as $file) {
    $result = fixChangelogLinks($file, $rootDir, VERBOSE);
    if ($result) {
        $fixed++;
    } else {
        $skipped++;
    }
}

echo "\n✅ Done! Fixed $fixed files, skipped $skipped files.\n";
echo "📝 Changelog links have been corrected based on file depth.\n";