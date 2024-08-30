# husky+lint-stage+commitlintでコミットメッセージの標準化とコミット前にeslintを実行する

## 背景

自動化

## 導入手順

### 開発環境

macOS 14.5（23F79）

pnpm 8.9.0

husky **v9.1.5**

lint-staged **v15**.2.9

eslint: 9.1.5

prettier: 3.3.3

commitlint

huskyとlint-stagedのバージョンは注意してください

### huskyの設定

husky + lint-stagedのインストールは以下をコピーアンドペーストして実行してください。

```sql
pnpm add --save-dev husky lint-staged && npx husky init && echo "npx lint-staged" > .husky/pre-commit
```

eslintとprettierを追加します。

```sql
pnpm add -D eslint prettier
```

```sql
npm init @eslint/config
echo {}> .prettierrc.json
```

typescriptに必要なモジュールを追加します。

```sql
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier
```

package.jsonを修正する

```sql
{
  "script": {
    "prepare": "husky install"
  },
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  },
  **"lint-staged": {
    "*.{ts, tsx}": "eslint --fix",
    "*": "prettier --write"
  }**
}
```

- メモ
    
    pre-commitが動作しない場合がある。
    
    huskyをインストールしたタイミングでpre-commitが作成されるが、git initを先にやっておく必要がある。git initできていない場合、git/hooksを削除して再度 huskyをインストールする。
    
    ```sql
    rm -rf .git/hooks
    git init
    ```
    

.git/hooksに置いてある `pre-commit.sample` を `pre-commit` にrenameする

その後、下記コマンドで実行権限を付与する

```sql
chmod +x .git/hooks/pre-commit
```

これで、コミット前にフックが起動して、 `.husky/pre-commit` の中の `lint-staged` が呼び出される。 `lint-staged` の実態は、package.jsonに書いてあるlint-stagedコマンド。つまり、eslint —fixとprettier —writeがステージされたファイルに対して実行される。

e.g. 

```tsx
// hello.ts
const f = (a: number, b: number): number => a * 2;

//   console.log(f(3,4))
// "prettier --write *.ts"の実行でスペースがなくなる
  console.log(f(3, 4));
console.log(f(3, 2));

```

このファイルをステージしてコミットすると、まず `b` という変数が使われていないとコミット時にエラーが発生してコミットできない。

```sql
error  'b' is defined but never used  @typescript-eslint/no-unused-vars
```

関数を修正後にコミットを行うと、スペース込みのconsole.logも修正された状態でコミットできる。

### commitlintの設定

```sql
pnpm add --save-dev @commitlint/cli @commitlint/config-conventional
```

.commitlintrc.jsをルートにつくって次の内容を記載する

```sql
module.exports = {   extends: ['@commitlint/config-conventional'], };

```

package.jsonに追加

```sql
{
  "scripts": {
    "commitmsg": "commitlint -e $GIT_PARAMS"
  }
}
```

huskyフックの追加

```sql
npx husky add .husky/commit-msg  'pnpm run commitmsg'
```

commit-msgというファイルが作られて、次の内容で生成されるよー

```sql
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run commitmsg
```

`pre-commit` ではなく、 `commit-msg` でフォルダ作るのがミソ

## 参考文献

[【2024/01最新】husky + lint-staged でコミット前にlintを強制する方法](https://zenn.dev/risu729/articles/latest-husky-lint-staged)

[Husky + Commitlintの統合使用 - Qiita](https://qiita.com/bsyo/items/451319d497194bd83971)

[【Git hooks】pre-commitフック導入](https://zenn.dev/sun_asterisk/articles/97d2b4be675c06)