 function mouseClicked() {
	shuffle(paletteSelected, true);
	 shuffle(bgpalette,true);
}
function randomCol(){
	let randoms = int(random(1,paletteSelected.length));
	return color(paletteSelected[randoms]);
 }
function bgCol(){
	let randoms = int(random(0,bgpalette.length));
	return color(bgpalette[randoms]);
 }

function gradient(r) {
	col1 = color(random(paletteSelected1));
	//col1.setAlpha(130)
	col2 = random(paletteSelected2);

	noStroke();
	let gradientFill = drawingContext.createLinearGradient(
		0,
		-r,
		0,
		r
	);
	gradientFill.addColorStop(0, color(col1));
	gradientFill.addColorStop(1, color(col2));
	drawingContext.fillStyle = gradientFill;
}
//example, [0]= background,[1]= stroke, [2~6] = fill
let bgpalette = 	["#488a50",  "#bf5513", "#3b6fb6", "#4f3224", "#9a7f6e","#1c3560", '#4a4e69',"#333","#413e49","#5da4a9"]
let  palettes = [
	["#e9dbce", "#ea526f", "#fceade", "#e2c290", "#6b2d5c", "#25ced1"],
	["#e9dbce", "#d77a61", "#223843", "#eff1f3", "#dbd3d8", "#d8b4a0"],
	["#e29578", "#006d77", "#83c5be", "#ffddd2", "#edf6f9"],
	["#e9dbce", "#cc3528", "#028090", "#00a896", "#f8c522"],
	["#e9dbce", "#92accc", "#f8f7c1", "#f46902", "#da506a", "#fae402"],
	["#e42268", "#fb8075", "#761871", "#5b7d9c", "#a38cb4", "#476590"],
	['#f9b4ab', '#679186', '#fdebd3', '#264e70', '#bbd4ce'],
	['#1f306e', '#c7417b', '#553772', '#8f3b76', '#f5487f'],
	['#e0f0ea', '#95adbe', '#574f7d', '#503a65', '#3c2a4d'],
	['#413e4a', '#b38184', '#73626e', '#f0b49e', '#f7e4be'],
	['#ff4e50', '#fc913a', '#f9d423', '#ede574', '#e1f5c4'],
	['#99b898', '#fecea8', '#ff847c', '#e84a5f', '#2a363b'],
	['#69d2e7', '#a7dbd8', '#e0e4cc', '#f38630', '#fa6900'],
	['#fe4365', '#fc9d9a', '#f9cdad', '#c8c8a9', '#83af9b'],
	['#ecd078', '#d95b43', '#c02942', '#542437', '#53777a'],
	['#556270', '#4ecdc4', '#c7f464', '#ff6b6b', '#c44d58'],
	['#774f38', '#e08e79', '#f1d4af', '#ece5ce', '#c5e0dc'],
	['#e8ddcb', '#cdb380', '#036564', '#033649', '#031634'],
	['#490a3d', '#bd1550', '#e97f02', '#f8ca00', '#8a9b0f'],
	['#594f4f', '#9de0ad', '#547980', '#45ada8', '#e5fcc2'],
	['#00a0b0', '#cc333f', '#6a4a3c', '#eb6841', '#edc951'],
	['#5bc0eb', '#fde74c', '#9bc53d', '#e55934', '#fa7921'],
	['#ed6a5a', '#9bc1bc', '#f4f1bb', '#5ca4a9', '#e6ebe0'],
	['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
	['#22223b', '#c9ada7', '#4a4e69', '#9a8c98', '#f2e9e4'],
	['#114b5f', '#1a936f', '#88d498', '#c6dabf', '#f3e9d2'],
	['#3d5a80', '#98c1d9', '#e0fbfc', '#ee6c4d', '#293241'],
	['#06aed5', '#f0c808', '#086788', '#fff1d0', '#dd1c1a'],
	['#540d6e', '#ee4266', '#ffd23f', '#3bceac', '#0ead69'],
	['#c9cba3', '#e26d5c', '#ffe1a8', '#723d46', '#472d30'],
	["#3c4cad", "#5FB49C", "#e8a49c"],
	["#1c3560", "#ff6343", "#f2efdb", "#fea985"],
	["#e0d7c5", "#488a50", "#b59a55", "#bf5513", "#3b6fb6", "#4f3224", "#9a7f6e"], //o-ball
	["#DEEFB7", "#5FB49C", "#ed6a5a"],
	["#2B2B2B", "#91B3E1", "#2F5FB3", "#3D4B89", "#AE99E8", "#DBE2EC"], //clipper_tea.snore&peace.
	["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff"],
	["#A8C25D", "#5B7243", "#FFA088", "#FFFB42", "#a9cff0", "#2D6EA6"], //2025/07/08
	["#F9F9F1",  "#191A18","#E15521", "#3391CF", "#E4901C", "#F5B2B1", "#009472"]//reference :: @posterlad :: https://x.com/posterlad/status/1963188864446566493
];
