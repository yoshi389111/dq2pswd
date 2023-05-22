# ふっかつのじゅもん２

## 概要

ふっかつのじゅもんを作れます。２の方です。 → [１はこちら](https://github.com/yoshi389111/dq1pswd)

各種項目を入力して呪文を作る方法と、呪文を入力して妥当性を確認する方法があります。

※現在、動作確認中のベータ版です。ご了承の上でご利用願います。

## 項目を入力して呪文を作る

[ふっかつのじゅもん２](https://yoshi389111.github.io/dq2pswd/)のページにいって、初期表示の画面が項目入力画面です。
（また、後述の呪文入力画面で左下の「項目を入力」ボタンを押すことで、画面遷移します）

４文字までで、名前を入力してください。
使用できる文字はひらがな（一部使えない文字があります）、数字、スペースのみです。
濁点、半濁点も一文字として数えます（例えば「が」は「か゛」に読み替えて２文字として扱います）。

具体的な使える文字は以下の通りです（見えませんが、スペースも使えます）。

```
０１２３４５６７８９
あいうえお
かきくけこ
さしすせそ
たちつてと
なにぬねの
はひふへほ
まみむめも
やゆよ
らりるれろ
わをん
っゃゅょ
゛゜　
```

その他の項目を選択して「呪文を確認」をクリックすると、呪文が表示されます。

クリップボードにコピーするか、ツイッターにツイートすることができます。

## 呪文を入力して妥当性を確認

[ふっかつのじゅもん２](https://yoshi389111.github.io/dq2pswd/)のページにいって、左下の「呪文を入力」ボタンを押すと、呪文入力画面が表示されます。

呪文を１８～５２文字で入力してください。
呪文として使える文字はひらがなだけです（一部使えない文字があります。「だ行」や拗音や促音などの小文字系など）。

濁点・半濁点は、分離せずに１文字と数えます（例：「が」は１文字）。

単独の濁点・半濁点の文字は無効です（例：「か゛」は無効な文字を除外して「か」と判断されます）。

具体的な使える文字は以下の通りです。

```
あいうえお
かきくけこ
さしすせそ
たちつてと
なにぬねの
はひふへほ
まみむめも
やゆよ
らりるれろ
わ
がぎぐげご
ざじずぜぞ
ばびぶべぼ
ぱぴぷぺぽ
```

見やすさのため、スペースを入力することもできます（呪文の文字数にはカウントしません）

右下の「呪文を確認」ボタンを押すと、呪文をチェックします。

## 語呂合わせのふっかつのじゅもんを作りたい場合

呪文を入力する際、ひらがな以外に「？」を入力していると、呪文として使えるパターンが表示されます。

「？」は最大３つまで書けますが、３つ書くと処理に時間がかかるので注意してください。

おもしろい語呂合わせのふっかつのじゅもんができたら、ツイッターなどで自慢しましょう。

## 自分の環境で動かす場合

適当に clone して動かしてください。

node.js が必要です。

package.json をみて start（開発中モードのWebが起動）か build（ビルドしたあと既存のwebサービスに登録して使用する）を起動してください。

既存のwebサーバに入れる場合には、パス名を package.json の homepage に登録（パスがなくてルートで動かすなら削除）してください。

## 改造したい場合

個人で使う分には好きに改造してください。

以下を使用しています。

* node.js
* typescript
* react

## ライセンス

MIT License

(C) 2023 SATO, Yoshiyuki

## その他のドキュメント

* [yoshi389111/dq1pswd](https://github.com/yoshi389111/dq1pswd) - ふっかつのじゅもんを作れます。１の方です。
