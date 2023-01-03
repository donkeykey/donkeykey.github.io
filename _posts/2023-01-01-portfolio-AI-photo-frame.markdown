---
type:   [hardware,AI]
permalink: /portfolio/ai-photo-frame
layout: portfolio
title:  AI描画アートフレーム
date:   2023-01-01 22:05:55 +0300
icon-image:  /assets/images/portfolio/ai-photo-frame.jpg
image:  /assets/images/portfolio/ai-photo-frame.jpg
author: Daichi Kawashima
---

#### WHAT <span style="font-size:18px;">何を作ったのか</span>
３時間に１回、AIが自動で電子ペーパーにランダムなアートを描画するフォトフレーム。

#### WHY <span style="font-size:18px;">なぜ作ったのか</span>
個人の想像や選択を超えて、無尽蔵でセレンディピティなアートとの一期一会を誰でも気軽に楽しんでもらいたい。

#### HOW <span style="font-size:18px;">どうやって作ったのか</span>
メインボードにはRaspberry Pi、ディスプレイには7色電子ペーパーを使用。あらかじめ設定したテキストからランダムに選択した内容をStable Diffusionが描画するようコーディングした。少ないメモリでも動作するStable Diffusionの特徴を活かしてRaspberry Piのように小型のメインボードでも駆動するように設計し、一般的なフォトフレームに収まるコンパクトで洗練されたサイズ感を実現した。

#### Twitter
<div class="row">
	<div class="col-lg-4">
		<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">ラズパイで <a href="https://twitter.com/hashtag/stablediffusion?src=hash&amp;ref_src=twsrc%5Etfw">#stablediffusion</a> 動かせたから3時間に1回適当に画像を生成して7色電子ペーパーで表示させるフォトスタンド作ったけどいいなこれ <a href="https://t.co/Ih5MKYRPmc">pic.twitter.com/Ih5MKYRPmc</a></p>&mdash; だいち (@daichi000daichi) <a href="https://twitter.com/daichi000daichi/status/1608786740759912450?ref_src=twsrc%5Etfw">2022年12月30日</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
	</div>
	<div class="col-lg-4">
		<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">今見たらなかなかいい絵になってた<a href="https://twitter.com/hashtag/stablediffusion?src=hash&amp;ref_src=twsrc%5Etfw">#stablediffusion</a> の詠唱文はリストにしてランダムでひとつ選んで実行してるので自分好みの絵が出るように調整できる。<br><br>ひとつの絵を生成する時間は1時間ちょっと。<br>もちろんエッジで処理してます。 <a href="https://t.co/gMqc4wGeLx">pic.twitter.com/gMqc4wGeLx</a></p>&mdash; だいち (@daichi000daichi) <a href="https://twitter.com/daichi000daichi/status/1609043334399688705?ref_src=twsrc%5Etfw">December 31, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
	</div>
	<div class="col-lg-4">
		<blockquote class="twitter-tweet" data-conversation="none"><p lang="ja" dir="ltr">せっかく7色電子ペーパーなのでカラフルな絵も描かせてみた。ピカソっぽいやつ。 <a href="https://t.co/BqjZQpJL1f">pic.twitter.com/BqjZQpJL1f</a></p>&mdash; だいち (@daichi000daichi) <a href="https://twitter.com/daichi000daichi/status/1608819771428200449?ref_src=twsrc%5Etfw">December 30, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
	</div>