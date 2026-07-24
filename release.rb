#!/usr/bin/env ruby

manifest = 'manifest.json'
package = 'package.json'

content = IO.read(manifest)
version = content.match(/"version": "(\d+\.\d+\.\d+)"/)[1]

parts = version.match(/(?<maj>\d+)\.(?<min>\d+)\.(?<patch>\d+)/)
maj = parts['maj']
min = parts['min']
patch = parts['patch'].to_i + 1

new_ver = "#{maj}.#{min}.#{patch}"

content.sub!(/"version": ".*?"/, "\"version\": \"#{new_ver}\"")

p_content = IO.read(package)
p_content.sub!(/"version": ".*?"/, "\"version\": \"#{new_ver}\"")

File.open(manifest, 'w') { |f| f.puts content }
File.open(package, 'w') { |f| f.puts p_content }

system('npm run build') or abort('build failed')

system('git add -A') or abort
system('git', 'commit', '-m', "version bump #{new_ver}") or abort
system('git push') or abort
system('gh', 'release', 'create', new_ver, '--generate-notes', 'manifest.json', 'main.js') or abort
