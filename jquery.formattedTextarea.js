/*
 * formattedTextarea, jQuery plugin
 * Licensed under the MIT license.
*/
(function ($)
{
  $.fn.extend(
  {
    formattedTextarea: function (options)
    {
      // Get default options, and merge with provided
      var defaults =
      {
        controls: {},                     // formatting controls to show
        substitution_string: '%s',        // replaced w/prompt_text or selection
        prompt_string: 'type text here',  // replaces sub string when no text is selected
        ul_class: 'format-ul',            // list class
        li_class: 'format-li'             // list element class
      };
      var options = $.extend(defaults, options);

      // For each matched <textarea>
      return this.each(function ()
      {
        // Grab object and generate list
        var obj = $(this);
        var list = $(document.createElement('ul'))
                    .addClass(options.ul_class)
                    .insertBefore(obj);

        // Add all formatting buttons from options
        for (option in options.controls)
        {
          // Generate formatting button
          var format = options.controls[option];
          $(document.createElement('li'))
            .html(option)
            .addClass(options.li_class)
            .click(function() {
              // Get selection and replacement
              var selection = $(obj).getSelection().text;
              var replacement = options.controls[$(this).html()];

              // Either insert or replace text
              if (selection == '') {
                $(obj).insertAtCaret(replacement.replace(options.substitution_string, options.prompt_string));
              } else {
                $(obj).replaceSelection(replacement.replace(options.substitution_string, selection), true);
              }

              return false;
            })
            .appendTo(list);
        }
      });
    }
  });
})(jQuery);
/*
 * Taken from: http://www.mail-archive.com/jquery-en@googlegroups.com/msg08708.html
 * Insert content at caret position (converted to jquery function)
 * @link http://alexking.org/blog/2003/06/02/inserting-at-the-cursor-using-javascript
 */
$.fn.insertAtCaret = function (myValue)
{
  return this.each(function ()
  {
    //IE support
    if (document.selection)
    {
      this.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
      this.focus();
    }
    //MOZILLA/NETSCAPE support
    else if (this.selectionStart || this.selectionStart == '0')
    {
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
      this.focus();
      this.selectionStart = startPos + myValue.length;
      this.selectionEnd = startPos + myValue.length;
      this.scrollTop = scrollTop;
    }
    else
    {
      this.value += myValue;
      this.focus();
    }
  });
};
/*
 * jQuery plugin: fieldSelection - v0.1.0 - last change: 2006-12-16
 * (c) 2006 Alex Brem <alex@0xab.cd> - http://blog.0xab.cd
 */
(function ()
{
  var fieldSelection =
  {
    getSelection: function ()
    {
      var e = this.jquery ? this[0] : this;
      return ( /* mozilla / dom 3.0 */ ('selectionStart' in e &&
      function ()
      {
        var l = e.selectionEnd - e.selectionStart;
        return {
          start: e.selectionStart,
          end: e.selectionEnd,
          length: l,
          text: e.value.substr(e.selectionStart, l)
        };
      }) || /* exploder */ (document.selection &&
      function ()
      {
        e.focus();
        var r = document.selection.createRange();
        if (r == null)
        {
          return {
            start: 0,
            end: e.value.length,
            length: 0
          }
        }
        var re = e.createTextRange();
        var rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return {
          start: rc.text.length,
          end: rc.text.length + r.text.length,
          length: r.text.length,
          text: r.text
        };
      }) || /* browser not supported */

      function ()
      {
        return {
          start: 0,
          end: e.value.length,
          length: 0
        };
      })();
    },
    replaceSelection: function ()
    {
      var e = this.jquery ? this[0] : this;
      var text = arguments[0] || '';
      return ( /* mozilla / dom 3.0 */ ('selectionStart' in e &&
      function ()
      {
        e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
        return this;
      }) || /* exploder */ (document.selection &&
      function ()
      {
        e.focus();
        document.selection.createRange().text = text;
        return this;
      }) || /* browser not supported */

      function ()
      {
        e.value += text;
        return this;
      })();
    }
  };
  jQuery.each(fieldSelection, function (i)
  {
    jQuery.fn[i] = this;
  });
})();
