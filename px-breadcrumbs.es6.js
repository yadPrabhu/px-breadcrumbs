(function() {
  Polymer({

    is: 'px-breadcrumbs', 

    properties: {
      /**
       * This array receives/holds the data that will be transformed into the breadcrumbs.
       */
      breadcrumbData: {
        type: Array,
        value: function() {return [];}
      },
      _mainPathItems: {
        type: Array,
        value: function() {return [];}
      },
      _clickItem: {
        type: Object,
        value: function() {return {};}
      },
      _clickedItemChildren: {
        type: Array,
        value: function() {return [];},
        
      },
      _isDropdownHidden: {
        type: Boolean,
        value: true
      },
      _selectedItem: {
        type: Object,
        value: function() {return {};}
      }
    },
    observers: ['_calculatePath(breadcrumbData.*, _selectedItem)'],
    /**
     * This method is used to determine where the path click came from - we have 3 different options, 
     * 1. the text
     * 2. the down chevron
     * 3. The side chevron
     * but we really want the encompossing LI, regardless of what was clicked. 
     * the two icons have a _iconsetName property that is 'fa' so we use that to determine if they were clicked, 
     * and if so, grab their parent, which is the LI.
     * @param {*} evt the event generated by the user tap
     */
    _normalizePathClickTarget(evt) {
      return (evt.target._iconsetName === 'fa') ? evt.target.parentNode.parentNode : evt.target;
    },
    /**
     * This method resets the existing _selectedItem
     */
    _resetSelectedItem() {
      this._selectedItem.selectedItem = false;
    },
    /**
     * This method is called on load, to calculate the initial Path, 
     * everytime a breadcrumb is clicked.
     * it recursively builds the path, while looking for the 
     * selectedItem.
     */
    _calculatePath() {
      var pathArray = [],
      currentDataObj = this.breadcrumbData,
      self = this,
      foundSelectedItem = false;
      console.log('_calculatePath');
      this.set('_mainPathItems',[]);
      var recursiveLoopThroughObj = function(pathItem) {
        for (var i=0, len = pathItem.length; i<len;i++) {
          console.log('pathItem[i] = ');
          console.log(pathItem[i]);
          if (foundSelectedItem) {
            break;
          };

          if (pathItem[i].selectedItem) {
              pathArray.push(pathItem[i]);
              self.set('_selectedItem', pathItem[i]);
              foundSelectedItem = true;
              break;
            }

          if (pathItem[i].children) {
            //if it has children, we want to keep digging in
            //so we push the item we are on into the pathArray
            //and call ourselves with the children of the current item
            pathArray.push(pathItem[i]);
            recursiveLoopThroughObj(pathItem[i].children)
          }
        }
      };

      //the initial call into the recursion
      recursiveLoopThroughObj(currentDataObj);

      //once all the recursion is done, we can set the value of 
      //_mainPathItems
      this.set('_mainPathItems', pathArray);
    },
   
    /**
     * This function checks whether the item in question has children.
     * @param {*} itemInPath 
     */
    _doesItemHaveChildren(itemInPath) {
      return itemInPath.hasChildren;
    },
    /**
     * This function is used to determine whether we are on the last Item in the array. - if 
     * the index is the last item in the aray (length -1), we return false.
     * @param {*} index 
     */
    _isNotLastItemInData(index) {
      return this._mainPathItems.length-1 !== index;
    },
    /**
     * This function is used to determine the correct classes that need to be passed in - if 
     * the index is the last item in the aray, we want it to be bold, so we pass the selected class.
     * 
     * @param {*} index This represents the index of the item we are looking at in the array.
     */
    _calculatePathclass(index) {
      return !this._isNotLastItemInData(index) ?  ' selected' : '';
    },
    /**
     * this method call a reset on whatever selected Item we 
     * previously had, and call a set on the new selectedItem 
     * @param {*} evt the click event from the dropdown item clicked
     */
    _dropdownTap(evt) {
      this._resetSelectedItem();
      console.log(evt);
      var newSelectItem = evt.model.item;
      this._setSelectedItem(newSelectItem);
    },
    /**
     * This method sets a _selectedItem set from the passed object.
     * @param {Object} selectedItem the new selected item
     */
    _setSelectedItem(selectedItem) {
      selectedItem.selectedItem = true;
      this.set('_selectedItem', selectedItem);
      console.log(selectedItem);
    },
    _onPathTap(evt) {
      var dataItem = evt.model.item;
      /* on tap, we need to find out if the clicked item is the same as before.
      * if it is, we make the dropdown go way.
      * if it is not, we save the new clicked item.
      */

      // if the selected item (the one at the end of the breadcrumb) has been clicked, ignore it.
      if (evt.model.item.selectedItem) {
        evt.stopPropagation();
        return;
      }
      if (this._clickItem === evt.model.item) {
        this.set('_isDropdownHidden', true);
        this.set('_clickItem', {});
      } else {
        this.set('_clickItem', dataItem);
        this.set('_isDropdownHidden', false);
      }
      // 1. Check if there are children. 

      if (this._doesItemHaveChildren(dataItem)) {
        this.set('_clickedItemChildren', dataItem.children);
      }
      var normalizedTarget = this._normalizePathClickTarget(evt),
          targetRect = normalizedTarget.getBoundingClientRect(),
          targetLeft = targetRect.left,
          targetBottom = targetRect.bottom,
          targetHeight = targetRect.height,
          windowScrollX = window.scrollX,
          windowScrollY = window.scrollY,
          dropdown = Polymer.dom(this.root).querySelector('.breadCrumbdropdown');
      console.log(targetRect);
      dropdown.style.top = (targetBottom + windowScrollY + 4) + 'px';
      dropdown.style.left = targetLeft + windowScrollX + 'px';
      
        // a. If there are kids, we need to update clickedItemChildren. 
        // b. If not, we fire an event that the clicked on item is the selected context.
      // 2. If there are children, we need to find the left/top/height of the clicked item, and calculate the positioning of the dropdown accordingly 
    },
    
    /**
     * 
     * @param {Object} clickedItem the clicked item
     * @return Object that holds the calculated top/left for the dropdown.
     */
    extractClickedPathItemPosition(clickedItem) {
      //TODO extract top/left/height from clickedItem.
      // then, calculate the new positioning, and save it into an object.
      // returns an object that holds the new top/left positioning.
    },
    /**
     * 
     * @param {Object} positioning an object which holds the new positioning for the dropdown
     */
    changeDropdownPosition(positioning) {
      //TODO find out if we are hitting the window edge. 
      //if we aren't, change the position of the dropdown to be under the clicked item
      //if we are, have smart positioning, 
    },
    /**
     * This method dispatches a custom event ('px-breadcrumbs-item-clicked') that has the item attached to it.
     * the 'composed: true' property makes it so the event passes through shadow dom boundaries.
     * @param {*} item the item that was clicked on.
     */
    _notifyClick(item) {
      //TODO fire an event with the clicked on item.
      this.dispatchEvent(new CustomEvent('px-breadcrumbs-item-clicked', {item: item, composed: true}));
    }
  });
})();
