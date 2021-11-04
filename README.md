# VRChatに文字を投げるやつ
## 依存
* yarn
* node.js (14以降)
* ffmpeg

## うちでのセットアップ
```
$ sudo apt install npm ffmpeg
$ sudo npm install -g n
$ sudo n lts #v16.13.0が入った
$ sudo npm install -g npm yarn
$ sudo apt remove npm
```
snap版のffmpegだとsnapの外の`/tmp`にアクセスできないらしいので、`send_text_to_vrc.publish(input: Array<File>, outputFile?: string, tempDirPrefix?: string)` の`tempDirPrefix`を指定して一時ファイルの生成先を別の場所に変える必要があるみたいです

## 使い方
```
$ yarn
$ yarn build
$ yarn start
```