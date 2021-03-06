/*
* An Object Of This Class Will Represent The Space Canvas That We will Draw On It 
* @param controller : reference to the game controller object

*/
function SpaceCanvas(controller)
{
	//============== Members ============//
	this.controller=controller;
	var id=controller.canvasId;
	var maxX=controller.maxX;
	var maxY=controller.maxY;
	var parentId=controller.canvasParentId;
	var step=controller.step;
	
	//===== factors to use when ( zoom in , zoom out , scale)
	var scaleFactor=1;
	var translateFactorH=0;
	var translateFactorV=0;
	
	//=== just to live a little padding between cell border and color
	var padding=1;
	
	// get the canvas and its context
	var canvas = document.getElementById(id);
    var context = canvas.getContext('2d');
	var self=this;
	//============== Members ============//
	
	//============== Methods ==============//
	// add on mouse click event listener
    canvas.addEventListener('click', function(evt) {
	
		var currentElement = this;
        var totalOffsetX=0;
		var totalOffsetY=0;
		
		//===== get the total offset of the canvas from the left and top of the screen
		do{
			totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
			totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
		}
		while(currentElement = currentElement.offsetParent)
		
		//===== get the scroll offset
		var doc = document.documentElement;
		var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		
		//===== check if browser is chrome
		var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		if(is_chrome){
			left=0; top=0;
		}
		
		//===== the click coordinates in the canvas
		var mousePos= { x:  ( ((evt.clientX - totalOffsetX)+left)/scaleFactor)+translateFactorH,
						y:  ( ((evt.clientY - totalOffsetY)+top)/scaleFactor)+translateFactorV
					  };
		//=== where does the cell coords start
		var startX=(mousePos.x)-(mousePos.x%step);
		var startY=(mousePos.y)-(mousePos.y%step);
		
		//===== change the status of the clicked cell ( set its status to live or dead)
		var clickRes=controller.addRemoveSeed(startX,startY);
		
		//==== fill or clear the clicked cell
		if(clickRes==1){
			context.fillStyle=controller.cellColor;
			context.fillRect(startX+padding,startY+padding,step-(2*padding),step-(2*padding));
		}
		else{
			context.clearRect(startX+padding,startY+padding,step-(2*padding),step-(2*padding));
		}
	}, false);
	
	//===========================//
	/*
	* This function will draw horizental and vertical lines between ( 0,maxX ) x , (0,maxY) y 
	*/
	this.draw=function(){
		// draw rows ( x coordinates )
		for(var i=0;i<maxX;i+=step)
		{
			context.strokeStyle='#EEEEEE';
			context.moveTo(0,i);
			context.lineTo(maxX,i);
			context.stroke();
		}
		// draw cols ( y coordinates )
		for(var i=0;i<maxY;i+=step)
		{
			context.strokeStyle='#EEEEEE';
			context.moveTo(i,0);
			context.lineTo(i,maxY);
			context.stroke();
		}
	}
	//===========================//
	
	//======================//
	/*
	* Kill the cell ( clear its color)
	*@param x : the cell x coordinates
	*@param y : the cell y coordinates
	*/
	this.killCell=function(x,y){
		context.clearRect(x+padding,y+padding,step-(padding*2),step-(padding*2));
	}
	//======================//
	
	//======================//
	/*
	* Revive the cell (color it)
	*@param x : the cell x coordinates
	*@param y : the cell y coordinates
	*/
	this.reviveCell=function(x,y){
		context.fillStyle=this.controller.cellColor;
		context.fillRect(x+padding,y+padding,step-(padding*2),step-(padding*2));
	}
	//======================//
	
	
	//======================//
	/*
	* To zoom in or out our space canvas
	*@param type: the type of zooming ( in =1 , out =2 )
	*/
	this.zoom=function(type){
		
		// clear the canvas
		canvas.width=canvas.width;
		// set scale factor based on zooming type
		if(type==1)
			scaleFactor++;
		else
			scaleFactor--;
		
		//=== just to limit the number of zooms
		if(scaleFactor<=0)
			scaleFactor=1;
		if(scaleFactor>6) 
			scaleFactor=6;
			
		// calculate the translation on x axis , translation on y axis  that must be done to focus
		// on the center of our canvas
		translateFactorH= ((scaleFactor*(canvas.width)/2)-((canvas.width)/2))/scaleFactor;
		translateFactorV= ((scaleFactor*(canvas.height)/2)-((canvas.height)/2))/scaleFactor;
		// scale and translate the canvas
		context.scale(scaleFactor,scaleFactor);
		context.translate(-translateFactorH,-translateFactorV);
		// redraw
		this.draw();
	}
	//======================//
	
	//======================//
	/*
	* Fill or clear cells in our canvas
	*@param type: the type of operation ( fill =1 , clear =2 )
	*@param cells : list of ( x,y) of cells we want to clear or fill
	*/
	//======================//
	this.fillClear=function(cells,type){
		for(var i=0;i<cells.length;i++)
		{
			if(type==1)
				this.reviveCell(cells[i].x,cells[i].y);
			else
				this.killCell(cells[i].x,cells[i].y);
		}
	}
	//======================//
	
	//============== Methods ==============//
}