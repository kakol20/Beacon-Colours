async function setup() {

	const size = Math.min(windowWidth, windowHeight);
	createCanvas(size, size);


	let font = await loadFont('css/minecraftfont.woff');
	textFont(font);
	textAlign(LEFT, TOP);
  fill(255);
  textWrap(WORD);
  textSize(15);

	noLoop();
}

function draw() {
	background(28);

	text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lobortis, dolor non aliquam convallis, dui diam condimentum tortor, eu eleifend velit lorem et diam. Quisque pulvinar urna vel nunc accumsan pulvinar. Suspendisse congue sem eu condimentum egestas. Duis at fermentum sapien. Donec eget mattis eros. Sed ultricies magna eget tortor lacinia facilisis. Nulla hendrerit fermentum odio, ut interdum nisl egestas eget. Maecenas quis nisl pharetra, scelerisque urna sit amet, commodo lacus. Nunc et tempus est. Donec auctor sapien at tortor dignissim vestibulum. Nullam pretium ornare massa. Vivamus eu tellus vitae velit fringilla fringilla. Integer accumsan placerat ligula, a consectetur arcu eleifend vitae. Sed quis orci semper, consectetur nisi a, dapibus velit. Morbi non fringilla orci.\n\nPraesent tincidunt nunc nec sollicitudin bibendum. Mauris id lectus lacinia, lobortis velit id, tempor nunc. Aenean eget vehicula magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam elit sapien, rutrum id sem eu, elementum viverra purus. Duis maximus purus sed mi congue tempus. Fusce justo ex, tincidunt nec ligula quis, blandit pharetra leo.', 10, 10, width - 20);

	let p = createP('Testing DOM');
	p.position(
		windowWidth > windowHeight ? width + 10 : 10, 
		windowHeight > windowWidth ? height + 10 : 10
	);
	p.attribute('align', 'left');
}