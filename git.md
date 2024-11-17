> Git is used to push & pull code to & from your branches. It streamlines the process of getting access to changes/updates in the codebase when working alongside others. It's possible to work on either terminal or using the version control interface on VScode.

## Terminal Commands

### Set Username & Email
- To set your email: `git config --global user.email "your-email@gmail.com"`<br>
- To set your username: `git config --global user.name "identifying-name"`

### Branches

`git branch` : see what branch you're on

`git branch branch-name` : creates a new branch <br>
*replace `branch-name` with what you'd like to name your branch*

`git checkout -b branch-name` : creates a new branch and takes you there as well. <br>
*replace `branch-name` with what you'd like to name your branch*

!!! info
    Although not necessary, it is highly recommended to create your own branch so you can streamline the process of sharing changes even when you're not done with your work. Make sure your branch name is descriptive so others can understand what the branch is for. 

`git branch -r` : see all branches

`git checkout branch-name`: go to branch (can be used to go to other peoples branches as well)
*replace `branch-name` with name of branch you're going to*
!!! warning
    Make sure to commit your changes before going to another branch

### Staging and Committing

`git add file-name` : stages your files to be committed <br>
*replace file-name with the name of the file(s) you made changes on* 

`git commit -m "describe the change"`: commits the changes you made, so that it can be pushed at some point <br>

### Pushing 

**Pushing to your team branch** <br>

`git push` 

**Pushing to your own branch for the first time** <br>
`git push --set-upstream origin BRANCH_NAME` <br>
*`BRANCH_NAME` should be name of your branch*
!!! info 
    It's necessary to use `--set-upstream origin BRANCH_NAME` the first time you're pushing something so that others can see your branch. If you'd like to keep your branch local for some reason, it can be omitted. 

    If you already pushed without setting upstream, use the following command:
    `git push origin BRANCH_NAME`

### Pulling & Merging

`git pull` : brings all changes from peers on the branch you're on

`git pull origin BRANCH_NAME` : brings changes from peers from a specifc branch 
*`BRANCH_NAME` is name of branch you're on*

**Bring your changes to another branch** <br>
1. Make sure all your changes are pushed to your branch (let's call it `YOUR_BRANCH`). <br>
2. Go to the branch you're bringing changes to (let's call it `BRANCH_NAME`) using 
`git checkout BRANCH_NAME`. <br>
3. Run the command `git pull` to make sure the branch is up to date. <br>
4. Run the command `git merge YOUR_BRANCH` <br>
5. If any, solve merge conflicts. You'll see it on your source control on the GUI. The conflicts will be highlighted in green on your editor. <br>
6. Run the command `git push`

**Bring your changes from another branch to your branch**<br>
1. Make sure all your changes are pushed to your branch (let's call it `YOUR_BRANCH`). <br>
2. Go to the branch you're bringing changes to (let's call it `BRANCH_NAME`) using 
`git checkout BRANCH_NAME`. <br>
3. Run the command `git pull` to make sure the branch is up to date. <br>
4. Go back to your branch using `git checkout YOUR_BRANCH` <br>
5. Run the command `git merge BRANCH_NAME`<br>
6. If any, solve merge conflicts. You'll see which files on your source control on the GUI. The conflicts will be highlighted in green on your editor. <br>
7. Run the command `git push`

!!! Warning
    You may have to do another `git pull` after using `git merge` **if you're running into issues**.

### See Previous Commits 

`git log` : the following command will show all commit history 

`git checkout commit-hash` : temporarily switch to that commit 

`git checkout -b old-state 0d1d7fc32` : if you want to add on to the previous commit, create a new branch with old changes

## Potential Issues

??? info "Pulling without specifying how to reconcile divergent branches"
    ``` 
    hint: Pulling without specifying how to reconcile divergent branches is
    hint: discouraged. You can squelch this message by running one of the following
    hint: commands sometime before your next pull:
    hint: 
    hint:   git config pull.rebase false  # merge (the default strategy)
    hint:   git config pull.rebase true   # rebase
    hint:   git config pull.ff only       # fast-forward only
    hint: 
    hint: You can replace "git config" with "git config --global" to set a default
    hint: preference for all repositories. You can also pass --rebase, --no-rebase,
    hint: or --ff-only on the command line to override the configured default per
    hint: invocation.
    ```
    The following message can usually be ignored and you just have to wait a few seconds for the changes to be pulled. However, if the error persists, you can following the intstructions they laid out. <br>
    `git config pull.rebase false`  <br>
    `git config pull.rebase true`   <br>
    `git config pull.ff only`       <br>

??? Bug 
    ```
    From https://source.developers.google.com/p/ninth-wares-272323/r/hello-world
    * branch                milestone-integration -> FETCH_HEAD
    fatal: It seems that there is already a rebase-merge directory, and
    I wonder if you are in the middle of another rebase. If that is the
    case, please try
        git rebase (--continue | --abort | --skip)
    If that is not the case, please
        rm -fr ".git/rebase-merge"
    and run me again. I am stopping in case you still have something
    valuable there.
    ```
    The following error might occur after you merge and do git pull. Usually the way to fix this is by: <br>
    1. `git push` : push all merge changes
    2. `git rebase --continue` it continues the rebase and everything should be back to normal <br>
    If that doesn't solve the issue, you can go back to a normal state by doing: <br>
    `git rebase --abort`