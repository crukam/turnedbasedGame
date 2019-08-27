//Global variables

let nb_rows=10,nb_cols=10,dimmeds=[],weapons=[],lifeinhasser=[],whoseturn={};
let audio= new Audio('sound/loop.mp3'),audio_start= new Audio('sound/start.mp3'),audio_move= new Audio('sound/water_pouring.wav'),audio_celebration= new Audio('sound/celebration.mp3');
let audio_startFight= new Audio('sound/start_fight.wav'),audio_canon= new Audio('sound/canon.flac'),audio_fanjanoScream= new Audio('sound/aah.mp3'),audio_walunguScream= new Audio('sound/ooh.mp3') ;
let audio_civilWar= new Audio('sound/war.wav'), win= new Audio('sound/win.mp3'),crowd= new Audio('sound/crowd.wav');
//loop music in the background
setTimeout(function()
			{ 
			 audio.play(); 
			 audio.addEventListener('ended',function()
											{
												audio.play();
											}); 
			}, 3000);

//class player

class player
{
	name="firstPlayer";
	position="0_0";
	weapon="knife";
	life=100;
	constructor(name,position)
	{
		this.name=name;
		this.position=position;
	}
	
}
// player declaration and initialisation

let playerOne= new player('firstPlayer','0_0'),playerTwo= new player('secondPlayer','9_9');
whoseturn = playerOne;
/*------------------------------------------*
 * function : create grid for the game      *
 * arguments: none                          *
 * return: none                             *
 *------------------------------------------*/
function createGrid()
{
	let row=$('#gameareaGrid');
	$('#gameareaGrid').empty();
	row.append('<div class="gridContainer" id="gridId">'+'</div>');
	row=$('#gridId');
	
	for(i=0;i<nb_rows;i++)
	{
		row.append('<div class="rowContainer" >'+'</div>');

		for(j=0;j<nb_cols;j++)
		{
			row.children().eq(i).append('<div class="cell-" id='+i+"_"+j+'></div>');
		}
	}
	
	$('#fanjanoFighter').animate({"marginRight":"200px"},3000);
	$('#walunguFighter').animate({"marginLeft":"200px"},3000);
}

/*--------------------------------------------*
 * function: check whether a tile is free     *
 * arguments: tile id                         *
 * return: boolean                            *
 *--------------------------------------------*/
function notBusycell(cell_id)
{
	if(weapons.indexOf(cell_id)>-1 || lifeinhasser.indexOf(cell_id)>-1 || dimmeds.indexOf(cell_id)>-1 || cell_id == playerOne.position || cell_id==playerTwo.position)
	{
		return false;
	}
	return true;
}
/*------------------------------------------------------------*
 * function: check whether Players are in touching tiles      *
 * arguments:none                                             *
 * return: boolean                                            *
 *------------------------------------------------------------*/
function playerTouching()
{
	let otherPlayer= whoseturn.name== 'firstPlayer'? playerTwo:playerOne;
	let x_player=parseInt(whoseturn.position.split('_')[0]), y_player=parseInt(whoseturn.position.split('_')[1]),x_otherplayer=parseInt(otherPlayer.position.split('_')[0]);
	let y_otherplayer=parseInt(otherPlayer.position.split('_')[1]);
	return ((x_player==x_otherplayer) && (y_player==y_otherplayer+1 || y_player==y_otherplayer-1)|| (y_player==y_otherplayer) && (x_player==x_otherplayer+1 || x_player==x_otherplayer-1));
}

/*-------------------------------------------------------------------------------------------*
 * function: get any weapon on the path between the clicked tile and the player              *
 * arguments: clicked tile id                                                                *
 * return: array of tiles with weapon on the path                                            *
 *-------------------------------------------------------------------------------------------*/
function weaponOnthepath(clicked_tile)
{
	let x_clicked=parseInt(clicked_tile.split('_')[0]), y_clicked=parseInt(clicked_tile.split('_')[1]),x_player=parseInt(whoseturn.position.split('_')[0]), y_player=parseInt(whoseturn.position.split('_')[1]);
	let res=[],y_index= y_player, x_index=x_player;
	
	if(x_player==x_clicked)
	{
		
		if(y_clicked>y_player)
		{
			
			for(y_index=y_player;y_index<y_player+3 && y_index<y_clicked && dimmeds.indexOf(x_player+'_'+y_index)==-1 ;y_index++)
			{
				if(weapons.indexOf(x_player+'_'+y_index)!==-1)
				{
					res.push(x_player+'_'+y_index);
				}
			}
		}
		if(y_clicked<y_player)
		{
			for(y_index=y_player;y_index<y_player+3&& y_clicked<y_index && dimmeds.indexOf(x_player+'_'+y_index)==-1 ;y_index--)
			{
				if(weapons.indexOf(x_player+'_'+y_index)!==-1)
				{
					res.push(x_player+'_'+y_index);
				}
			}
			
		}
	}
	if(y_clicked==y_player)
	{
		if(x_clicked>x_player)
		{
			for(x_index=x_player;x_index<x_player+3 && x_clicked>x_index && dimmeds.indexOf(x_index+'_'+y_player)==-1 ;x_index++)
			{
				
				if(weapons.indexOf(x_index+'_'+y_player)!==-1)
				{
					res.push(x_index+'_'+y_player);
				}
			}
			
		}
		if(x_clicked<x_player)
		{
			for(x_index=x_player;x_index<x_player+3 && x_clicked<x_index && dimmeds.indexOf(x_index+'_'+y_player)==-1 ;x_index--)
			{
				
				if(weapons.indexOf(x_index+'_'+y_player)!==-1)
				{
					res.push(x_index+'_'+y_player);
				}
			}
			
		}
		
		
	}
	if(x_index==x_clicked || y_index==y_clicked)
	{	
		return res;
	}
    else
	{ 
		return null;
	}
}

/*--------------------------------------------------------------------------------------------*
 * function: check whether there is a dimmed tile on the path ( player and clicked tile)      *
 * arguments: clicked tile id                                                                 *
 * retuen: boolean                                                                            *
 *--------------------------------------------------------------------------------------------*/
function tiledimmedOnthepath(clicked_tile)
{
	let x_clicked=parseInt(clicked_tile.split('_')[0]),y_clicked=parseInt(clicked_tile.split('_')[1]),x_player=parseInt(whoseturn.position.split('_')[0]), y_player=parseInt(whoseturn.position.split('_')[1]);
	let x_index=x_player, y_index=y_player;
    if(x_clicked== x_player && allowedMove(clicked_tile))
	{
		if(y_player<y_clicked )
		{
			for(y_index=y_player;y_index<y_clicked  && dimmeds.indexOf(x_clicked+'_'+y_index)==-1;y_index++)
				;
		}
		if(y_player>y_clicked )
		{
			for(y_index=y_player;y_index>y_clicked && dimmeds.indexOf(x_clicked+'_'+y_index)==-1;y_index--)
				;
		}
	}
	if(y_clicked==y_player && allowedMove(clicked_tile))
	{
		if(x_player<x_clicked)
		{
			for(x_index=x_player;x_index<x_clicked && dimmeds.indexOf(x_index+'_'+y_index)==-1;x_index++)
				;
		}
		if(x_player>x_clicked)
		{
			for(x_index=x_player;x_index>x_clicked && dimmeds.indexOf(x_index+'_'+y_index)==-1;x_index--)
				;
		}
	}
	return(x_clicked!=x_index || y_clicked!=y_index );
}
/*------------------------------------------------------------------------------*
 * function: display div with the playing player                                *
 * arguments: none                                                              *
 * return: none                                                                 *
 *------------------------------------------------------------------------------*/

function displayFighterbox()
{
	let selector='', extralife=0;
	selector= whoseturn.name=='firstPlayer'? '#walunguWeapon':'#fanjanoWeapon';
	$(selector).empty();
	$(selector).append('<div class="playerBox" ><b>play</div>');
	$(selector).append('<div class="displayWeapon">weapon:'+' ' +whoseturn.weapon+'</div>');
	$(selector).append('<div class="displayWeapon">power:'+ ' '+weaponPower(whoseturn.weapon)+'</div>');
	extralife= whoseturn.life-100>0? whoseturn.life-100:0;
	$(selector).append('<div class="displayHealth">extra life:'+' ' +extralife+'</div>');
	
}
/*------------------------------------------------------------------------------*
 * function: display div with the player waiting to play                        *
 * arguments: none                                                              *
 * return: none                                                                 *
 *------------------------------------------------------------------------------*/

function displayFighterWaiting()
{
	let selector='', extralife=0;
	selector= whoseturn.name=='firstPlayer'? '#fanjanoWeapon' :'#walunguWeapon';
	let prevPlayer= whoseturn.name=='firstPlayer'? playerTwo:playerOne;
	$(selector).empty();
	$(selector).append('<div class="playerBox" ><b>wait for your turn</div>');
	$(selector).append('<div class="displayWeapon">weapon:'+' ' +prevPlayer.weapon+'</div>');
	$(selector).append('<div class="displayWeapon">power:'+ ' '+weaponPower(prevPlayer.weapon)+'</div>');
	extralife= prevPlayer.life-100>0? prevPlayer.life-100:0;
	$(selector).append('<div class="displayHealth">extra life:'+' ' +extralife+'</div>');
	
}

/*----------------------------------------------------------------------------*
 * function: check clicked tile is in the acceptable (to move to) tiles       *
 * arguments: none                                                            *
 * return: none                                                               *
 *----------------------------------------------------------------------------*/

function allowedMove(clicked_tile)
{
	let x_clicked=parseInt(clicked_tile.split('_')[0]),y_clicked=parseInt(clicked_tile.split('_')[1]),x_player=parseInt(whoseturn.position.split('_')[0]), y_player=parseInt(whoseturn.position.split('_')[1]);
	return (x_clicked==x_player &&  Math.abs(y_clicked-y_player)<=3|| y_clicked==y_player &&  Math.abs(x_clicked-x_player)<=3 )
}
function movePlayer(clicked_tile)
{
	let x_clicked=parseInt(clicked_tile.split('_')[0]),y_clicked=parseInt(clicked_tile.split('_')[1]),x_player=parseInt(whoseturn.position.split('_')[0]), y_player=parseInt(whoseturn.position.split('_')[1]);
	if(allowedMove(clicked_tile)&& !tiledimmedOnthepath(clicked_tile))
	{
		
		let weapon=weaponOnthepath(clicked_tile);
		
		if(weapon!=null && weapon.length>0)
		{
			$.each(weapon,function(){
				x_weapon=parseInt(this.split('_')[0]);
				y_weapon=parseInt(this.split('_')[1]);
				let weaponclass=$('#gameareaGrid div:first-child').children().eq(x_weapon).children().eq(y_weapon).attr('class');
				$('#gameareaGrid div:first-child').children().eq(x_weapon).children().eq(y_weapon).removeClass().addClass('cell-'+whoseturn.weapon);
				whoseturn.weapon=weaponclass.split('-')[1];
				let selector= whoseturn.name=='firstPlayer'? '#walunguWeapon':'#fanjanoWeapon';
				$(selector).children().eq(1).html('weapon:'+whoseturn.weapon );
			});
			
		}
		$('#gameareaGrid div:first-child').children().eq(x_player).children().eq(y_player).removeClass().addClass('cell-');
		$('#gameareaGrid div:first-child').children().eq(x_clicked).children().eq(y_clicked).removeClass().addClass('cell-'+whoseturn.name);
		whoseturn.position=x_clicked+'_'+y_clicked;
		audio_move.play();
	}
	return allowedMove(clicked_tile) && !tiledimmedOnthepath(clicked_tile);
}

/*------------------------------------------------------------------------------*
 * function: initialise the grid with player, weapons and inhasser              *
 * arguments: none                                                              *
 * return: none                                                                 *
 *------------------------------------------------------------------------------*/
function init()
{
	
	$('#gridId').children().eq(0).children().eq(0).removeClass().addClass("cell-firstPlayer");
	
	$('#gridId').children().eq(9).children().eq(9).removeClass().addClass("cell-secondPlayer");
	for(k=0;k<24;k++)
	{
		 i=Math.floor(Math.random()*nb_rows);
		 j=Math.floor(Math.random()*nb_cols);
		if(i+"_"+j != '0_0' && i+"_"+j != '9_9'  && notBusycell(i+"_"+j ))
		{
			if(k<4)
			{
				switch(k)
				{
					case 0:
						$('#gridId').children().eq(i).children().eq(j).removeClass().addClass("cell-knife");
						
						break;
					case 1:
						$('#gridId').children().eq(i).children().eq(j).removeClass().addClass("cell-sai");
						break;
					case 2:
						$('#gridId').children().eq(i).children().eq(j).removeClass().addClass("cell-sore");
						break;
					case 3:
						$('#gridId').children().eq(i).children().eq(j).removeClass().addClass("cell-gun");
						break;
					default:
						break;
				}
				weapons.push(i+"_"+j);
			}
			if(k>=4 && k<12)
			{
				$('#gridId').children().eq(i).children().eq(j).removeClass().addClass("cell-dimmed");
				dimmeds.push(i+"_"+j);
			}
			if(k>=12 && k<18 )
			{
				$('#gridId').children().eq(i).children().eq(j).removeClass().addClass("cell-coin");
				lifeinhasser.push(i+"_"+j);
			}
			if(k>=18)
			{
				$('#gridId').children().eq(i).children().eq(j).removeClass().addClass("cell-potion");
				lifeinhasser.push(i+"_"+j);
			}
		}
		else
		{
			k--;
		}
	}
}

/*------------------------------------------------------------*
 * function: give the power for a given weapon                *
 * arguments:  string weapon                                  *
 * return: integer power                                      *
 *------------------------------------------------------------*/
function weaponPower(weapon)
{
	switch(weapon)
	{
		case 'knife':
			return 10;
		case 'sai':
			return 15;
		case 'sore':
			return 20;
		case 'gun':
			return 25;
		default:
			return 0;
	}
}
/*-----------------------------------------------------------------------------*
 * function: update the life and initiliase other variables in the battle      *
 * arguments: button id                                                        *
 * return: none                                                                *
 ------------------------------------------------------------------------------*/
function keepFighting(clickedButton)
{
	if(clickedButton=='#fireWalungubutton')
	{
		audio_fanjanoScream.volume=0.2;
		audio_fanjanoScream.play();
		let $selector= whoseturn.name=='firstPlayer'? $('#fanjanoHealth'):$('#walunguHealth');
		$('#fireFanjanobutton').removeClass().addClass('buttonFight');
		$('#shieldFanjanobutton').removeClass().addClass('buttonFight');
		whoseturn= whoseturn.name=='firstPlayer'? playerTwo:playerOne;
		whoseturn.life-=weaponPower(whoseturn.weapon);
		$selector.html(whoseturn.life+'%');
		displayFighterbox();
		displayFighterWaiting();
		$('#fireWalungubutton').removeClass().addClass('buttonFightDisabled');
		$('#shieldWalungubutton').removeClass().addClass('buttonFightDisabled');
	}
	if (clickedButton=='#fireFanjanobutton')
	{
		audio_walunguScream.volume=0.2;
		audio_walunguScream.play();
		let $selector= whoseturn.name=='firstPlayer'? $('#fanjanoHealth'):$('#walunguHealth');
		$('#fireWalungubutton').removeClass().addClass('buttonFight');
		$('#shieldWalungubutton').removeClass().addClass('buttonFight');
		whoseturn= whoseturn.name=='firstPlayer'? playerTwo:playerOne;
		whoseturn.life-=weaponPower(whoseturn.weapon);
		$selector.html(whoseturn.life+'%');
		displayFighterbox();
		displayFighterWaiting();
		$('#fireFanjanobutton').removeClass().addClass('buttonFightDisabled');
		$('#shieldFanjanobutton').removeClass().addClass('buttonFightDisabled');
	}
	if (clickedButton=='#shieldFanjanobutton')
	{
		let $selector= whoseturn.name=='firstPlayer'? $('#fanjanoHealth'):$('#walunguHealth');
		$('#fireWalungubutton').removeClass().addClass('buttonFight');
		$('#shieldWalungubutton').removeClass().addClass('buttonFight');
		let playerSelf=whoseturn;
		whoseturn= whoseturn.name=='firstPlayer'? playerTwo:playerOne;
		playerSelf.life+=(weaponPower(whoseturn.weapon)/2);
		$selector.html(whoseturn.life+'% '+'life');
		displayFighterbox();
		displayFighterWaiting();
		$('#fireFanjanobutton').removeClass().addClass('buttonFightDisabled');
		$('#shieldFanjanobutton').removeClass().addClass('buttonFightDisabled');
	}
	if (clickedButton=='#shieldWalungubutton')
	{
		let $selector= whoseturn.name=='firstPlayer'? $('#fanjanoHealth'):$('#walunguHealth');
		$('#fireFanjanobutton').removeClass().addClass('buttonFight');
		$('#shieldFanjanobutton').removeClass().addClass('buttonFight');
		let playerSelf=whoseturn;
		whoseturn= whoseturn.name=='firstPlayer'? playerTwo:playerOne;
		playerSelf.life+=(weaponPower(whoseturn.weapon)/2);
		$selector.html(whoseturn.life+'%'+'life');
		displayFighterbox();
		displayFighterWaiting();
		$('#fireWalungubutton').removeClass().addClass('buttonFightDisabled');
		$('#shieldWalungubutton').removeClass().addClass('buttonFightDisabled');
	}
}

/*--------------------------------------------------------*
 * function: run to end the game                          *
 * arguments: none                                        *
 * return: none                                           *
 *--------------------------------------------------------*/
function endGame()
{
	//alert(playerOne.life);
	//alert(playerTwo.life);
	setTimeout(function()
			{ 
			 audio.pause();
			 audio_civilWar.pause();
			 crowd.play();
			 win.play();
			
			 win.addEventListener('ended',function()
											{
												win.volume=0.5;
												win.play();
											}); 
			}, 3000);
	
	 $('#mygameflexContainer').empty();
	$('#mygameflexContainer').append('<div class="endGameContainer" id="myendgameContainer" style="justify-content:flex-end"></div>');
	$("body").css({'background-image':'none'});
	$('#pageTitle').hide();
	//$('#myendgameContainer').html('<img src="image/confetti.png">').animate({"width":"+800px","height":"+800px"},3000).fadeOut(3000);
	$('#myendgameContainer').empty();
	$('#myendgameContainer').css({'marginLeft':'200px'});

	if(playerOne.life > 0)
	{
		$('.buttonReplay').css({'background-color':'#7F7F7F'});
		$('#myendgameContainer').html('<div><img  class="imgWinner" src="image/walunguwinner.png"></div>').animate({"width":"800px","height":"800px"},3000).fadeIn(3000);;
	}
	if(playerTwo.life > 0)
	{
		$('.buttonReplay').css({'background-color':'#880015'});
		$('#myendgameContainer').html('<div><img class="imgWinner" src="image/fanjanowinner.png"></div>').animate({"width":"800px","height":"800px"},3000).fadeIn(3000);
	}
		$('#myendgameContainer').append('<button type="button" class="buttonReplay">Replay</button>');
		
	playerOne.life > 0?  $('.buttonReplay').css({'background-color':'#7F7F7F','color':'white'}): $('.buttonReplay').css({'background-color':'#880015','color':'white'});
	
	 $('#mygameflexContainer div:first-child').on('click','.buttonReplay',function(){
		$('#mygameflexContainer').empty();
		$("body").css({'background-image':'url("../image/background.png")'})
		audio_start.play();
		createGrid();
		init();
		whoseturn=playerOne;
		displayFighterbox();
		displayFighterWaiting();
	 });
	
}
/*-------------------------------------------------------------*
 * function: run when players are fighting                     *
 * arguments: none                                             *
 * return: none                                                *
 *-------------------------------------------------------------*/
function playFight()
{
	$('#fanjanoFighter').hide();
	$('#walunguFighter').hide();
	$('#gameareaGrid').empty();
	$('#gameareaGrid').html('<img src="image/fire.png"class="center" id="fightimage">');
	$('#gameareaGrid').children().eq(0).animate({width:'2000px',height:'800px'},2000);
	audio_startFight.play();
	audio_canon.play();
	$('#gameareaGrid').children().eq(0).fadeOut(3000);
	$("body").css({'background-image':'none'});
	$('#pageTitle').html('Walungus fighting Fanjanos');
	setTimeout(function(){
		audio_start.play();
		$('#mygameflexContainer').css({'height':'1000px','width':'1000px','marginLeft':'300px'});
		$('#fanjanoFighter').css('flex','6');
		$('#walunguFighter').css('flex','6');
		$('#gameareaGrid').remove();
		$('#fanjanoFighter').show();
		$('#walunguFighter').show();
		$('.walunguImage').css({'height':'200px'});
		$('.fighterWeapon').html('');
		$('.fighterImage').css({'backgroundColor':'#7f7f7f'});
		$('#fanjanoFighter').animate({"marginLeft":"30px" },3000);
		$('#walunguFighter').animate({"marginRight":"30px" },3000);
		displayFighterbox();
		displayFighterWaiting();
		},3000);
	$('#walunguFighter').append('<div class="rowContainer" style="justify-content: space-evenly;">'+
								'<button id="fireWalungubutton" class="buttonFight" type="button" align="center">'+
								'Fire</button><button id="shieldWalungubutton" class="buttonFight" type="button" align="center">'+
								'Shield</button>'+
								'</div>');
	$('#fanjanoFighter').append('<div class="rowContainer" style="justify-content: space-evenly;">'+
								'<button id="fireFanjanobutton" class="buttonFight" type="button" align="center">'+
								'Fire</button><button id="shieldFanjanobutton" class="buttonFight"  type="button" align="center">'+
								'Shield</button></div>');
	let $selector= whoseturn.name=='firstPlayer'? $('#fireFanjanobutton'):$('#fireWalungubutton');
	$selector.removeClass().addClass('buttonFightDisabled');
	$selector= whoseturn.name=='firstPlayer'? $('#shieldFanjanobutton'):$('#shieldWalungubutton');
	$selector.removeClass().addClass('buttonFightDisabled');
	
	setTimeout(function()
			{ 
			 audio.pause();
			 audio_civilWar.volume=0.5;
			 audio_civilWar.play(); 
			 audio_civilWar.addEventListener('ended',function()
											{
												audio_civilWar.volume=0.5;
												audio_civilWar.play();
											}); 
			}, 500);
	$('#fireWalungubutton').bind('click',function(){
		playerOne.life>0 && playerTwo.life>0? keepFighting('#fireWalungubutton'):endGame();
	});
	$('#fireFanjanobutton').bind('click',function(){
		playerOne.life>0 && playerTwo.life>0 ? keepFighting('#fireFanjanobutton'):endGame();
	});
	$('#shieldFanjanobutton').bind('click',function(){
		playerOne.life>0 && playerTwo.life>0? keepFighting('#shieldFanjanobutton'): endGame();
	});
	$('#shieldWalungubutton').bind('click',function(){
		playerOne.life>0 && playerTwo.life>0 ? keepFighting('#shieldWalungubutton'): endGame();
	});
}

/*-----------------------------------------------------------------------------------------------------*
 *function: run to carry out the move when a tile is clicked does not contain a weapon                 *
 * arguments: clicked id && extra life in the tile                                                     *
 * return: none                                                                                        *
 *-----------------------------------------------------------------------------------------------------*/
function playClickonTile(id,extralife)
{
	if(typeof extralife==='undefined' && typeof id=== 'undefined')
	{
		whoseturn.name=='firstPlayer'?playerOne=whoseturn:playerTwo=whoseturn;
		whoseturn= whoseturn.name=='firstPlayer'? playerTwo:playerOne;
		displayFighterbox();
		displayFighterWaiting();
	}
	else
	{
		let selector=' ';
		audio_celebration.play();
		whoseturn.life+=extralife;
		lifeinhasser[lifeinhasser.indexOf(id)]=-1;
		whoseturn.name=='firstPlayer'?playerOne=whoseturn:playerTwo=whoseturn;
		whoseturn= whoseturn.name=='firstPlayer'? playerTwo:playerOne;
		displayFighterbox();
		displayFighterWaiting();
		selector= whoseturn.name=='firstPlayer'? '#fanjanoWeapon' :'#walunguWeapon';
		$(selector).append('<div class="playerBox" > Wao potion'+' '+ extralife+' '+ 'extra life!!</div>');
	}
}
/*-----------------------------------------------------------------------------------------------------*
 *function: run to carry out the move when a tile is clicked  contain a weapon                         *
 * arguments: clicked id && extra life in the tile                                                     *
 * return: none                                                                                        *
 *-----------------------------------------------------------------------------------------------------*/
function playClickonWeapon(id,weapon)
{
	prevPlayer= whoseturn.name=='firstPlayer'? playerOne:playerTwo;
	let x_weapon=parseInt(id.split('_')[0]),y_weapon=parseInt(id.split('_')[1]),x_player=parseInt(whoseturn.position.split('_')[0]),y_player=parseInt(whoseturn.position.split('_')[1]);
	$('#gameareaGrid div:first-child').children().eq(x_weapon).children().eq(y_weapon).removeClass().addClass(weapon);
	weapons[weapons.indexOf(whoseturn.position)]=id;
	$('#gameareaGrid div:first-child').children().eq(x_player).children().eq(y_player).removeClass().addClass('cell-'+whoseturn.name);
	whoseturn.name=='firstPlayer'?playerOne=whoseturn:playerTwo=whoseturn;
	whoseturn= whoseturn.name=='firstPlayer'? playerTwo:playerOne;
	displayFighterbox();
	displayFighterWaiting();
}
//main function
$(document).ready(function()
{
	let prevPosition=' ';
	// start of the game
	$('#buttonStart').click(function(){
		audio_start.play();
		createGrid();
		init();
		whoseturn=playerOne;
		displayFighterbox();
		displayFighterWaiting();
	});
	//listen for a click on a free cell
	$('#gameareaGrid').on('click','.cell-',function(){
		if(movePlayer(this.id) && !playerTouching())
		  playClickonTile();
		if(playerTouching())
		  playFight();
	});
	//listen for a click on a  cell containing a coin
	$('#gameareaGrid').on('click','.cell-coin',function(){
		if(movePlayer(this.id) && !playerTouching())
			playClickonTile(this.id,10);
		if(playerTouching())
			playFight();
	});
	//listen for a click on a  cell containing a potion
	$('#gameareaGrid').on('click','.cell-potion',function(){
		if(movePlayer(this.id) && !playerTouching())
		 playClickonTile(this.id,15);
		if(playerTouching())
		 playFight();
	});
	//listen for a click on a  cell containing a knife
	$('#gameareaGrid').on('click','.cell-knife',function(){
		prevPosition=whoseturn.position;
		if(movePlayer(this.id) && !playerTouching())
		  playClickonWeapon(prevPosition,'cell-knife');
	    if(playerTouching())
		  playFight();
		});
	//listen for a click on a  cell containing a sai	
	$('#gameareaGrid').on('click','.cell-sai',function(){
		prevPosition=whoseturn.position;
		if(movePlayer(this.id) && !playerTouching())
		
		  playClickonWeapon(prevPosition,'cell-sai');
	    if(playerTouching())
		  playFight();
	});
	//listen for a click on a  cell containing a sore
	$('#gameareaGrid').on('click','.cell-sore',function(){
		prevPosition=whoseturn.position;
		if(movePlayer(this.id)  && !playerTouching())
		  playClickonWeapon(prevPosition,'cell-sore');
	    if(playerTouching())
		  playFight();
	});
	//listen for a click on a  cell containing a gun
	$('#gameareaGrid').on('click','.cell-gun',function(){
		prevPosition=whoseturn.position;
	  if(movePlayer(this.id) && !playerTouching())
		 playClickonWeapon(prevPosition,'cell-gun');
	  if(playerTouching())
		 playFight();
	});
});

	