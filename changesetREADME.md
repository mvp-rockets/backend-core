###changeset versioning

####How to install?
 * `npm install @changesets/cli && npx changeset init`

####How to use it?
####`init`

    `changeset init`
####`add`
 * Go to the root folder of the package.json and run the following command
   * ` changeset add `
   * This command will ask you a series of questions, first about what packages you want to release, then what semver bump type for each package, then it will ask for a summary of the entire changeset. The final step will show the changeset it will generate and confirm that you want to add it.

####`version`
   * `changeset version`
   * This is one of two commands responsible for releasing packages. The version command takes changesets that have been made and updates versions and dependencies of packages, as well as writing changelogs. It is responsible for all file changes to versions before publishing to npm.

####`git tags`
   * `changeset tag`
     *  This will create the tag with latest version 
   * `git push --tags`
     *  To push the tags with latest version of git tags 

    

