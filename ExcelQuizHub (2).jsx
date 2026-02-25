import { useState, useEffect, useRef } from "react";

// ── NORMALIZE: both "options" and "opts" fields → always "options" ──
function norm(arr) {
  return arr.map(q => ({ ...q, options: q.options || q.opts || [] }));
}

const RAW_Week1 = [
  { q: "Which key do you hold down when selecting cells in different areas of a worksheet?", options: ["Control + Shift at the same time","The Control (PC) / Command (Mac) key","The Tab key","The Shift key","Control + Tab at the same time"], correct: [1], multi: false, fb: "Ctrl/Cmd lets you select non-contiguous cells." },
  { q: "Which components must be part of any formula? (Select all that apply)", options: ["The = sign","Parenthesis","Brackets","A mathematical operator (e.g. +)","A function (e.g. SUM)"], correct: [0,3,4], multi: true, fb: "Every formula must start with = and include an operator or function." },
  { q: "What did Sean enter in cell B7 to calculate the average of Quarter 1 sales?", options: ["=AVERAGE(B4:B6)","=AVERAGE(B4:6)","=AVERAGE(B4+B6)","=AVG(B4:B6)","=AVERAGE(B4):AVERAGE(B6)"], correct: [0], multi: false, fb: "=AVERAGE(B4:B6) calculates the average of a range." },
  { q: "To change the relative reference A1 to an absolute cell reference, you use:", options: ["A$1S","a1","$A$1",'"A1"',"ABS(A1)"], correct: [2], multi: false, fb: "$A$1 locks both the column and row references." },
  { q: "You want to copy formatting from one set of cells to another. What do you do?", options: ["Use the Format Painter to copy only the formats","Copy cells over new cells, then re-type data","Use the Format Cells option after right-clicking","Cells must be formatted before data is entered","You can't — format each cell individually"], correct: [0], multi: false, fb: "Format Painter is a powerful tool for copying formatting!" },
  { q: "You want to insert 3 columns. What will get you there? (Select all that apply)", options: ["Select a column, click Insert on Home tab 3 times","Select 3 columns, right-click → Insert","Right-click column header → Insert, type number 3"], correct: [0,1], multi: true, fb: "Both methods work for inserting multiple columns." },
  { q: "You want to show only values greater than 1,000 in a column. What's the fastest way?", options: ["Move values less than 1,000 to another sheet","Remove checkmarks next to values below 1,000","Apply a number filter using 'is greater than' 1,000","Sort the column from largest to smallest","Use the MAX function"], correct: [2], multi: false, fb: "Filtering is the fastest method!" },
  { q: "Your data spans 3 pages. You want it on 2. What can you do? (Select all that apply)", options: ["Use Scale to Fit tools","Use Page Layout view → set width to 2 pages","Use narrower margins","Remove less important columns"], correct: [0,1,2,3], multi: true, fb: "All these techniques help fit data onto fewer pages." },
  { q: "Excel is an example of what type of software?", options: ["Spreadsheet Software","Presentation Package","Word Processor"], correct: [0], multi: false, fb: "Other examples include Apple Numbers and Google Sheets." },
  { q: "Which of the following is NOT part of the Ribbon?", options: ["Insert","Data","Tools","Home"], correct: [2], multi: false, fb: "'Tools' is not a tab of the Excel Ribbon." },
  { q: "My Ribbon has disappeared — how can I get it back? (Select all that apply)", options: ["Right-click a tab → untick 'Collapse the Ribbon'","Close Excel and reopen it","Double-click on any ribbon tab","Switch to another worksheet"], correct: [0,2], multi: true, fb: "Right-clicking or double-clicking restores the Ribbon." },
  { q: "From the File tab (Backstage View), you can: (Select all that apply)", options: ["Open a file","Set up Excel options","Create a blank workbook","Close a file"], correct: [0,1,2,3], multi: true, fb: "Backstage View handles file management, settings, and more." },
  { q: "The tools on the far right of the status bar allow you to: (Select all that apply)", options: ["Set a specific zoom percentage","Toggle between View Options","Access the Backstage View","Use the zoom slider"], correct: [0,1,3], multi: true, fb: "These tools adjust the spreadsheet view easily." },
  { q: "The four-headed arrow mouse pointer in Excel allows you to:", options: ["Delete data","Copy data","Select data","Move data"], correct: [3], multi: false, fb: "This pointer lets you move data from one location to another." },
  { q: "Which is the Active Cell? (The one with the green border and small square)", options: ["A1","A2","C2","B1"], correct: [3], multi: false, fb: "An active cell has a green border and a small square in the bottom-right." },
  { q: "To select the whole of column B, we:", options: ["Click and drag from B1 down to B1000","Click File → Select Column","Double-click on cell B1","Click on the B column header"], correct: [3], multi: false, fb: "Clicking the column letter header selects the entire column." },
  { q: "Shortcut key to select all the data in a data block:", options: ["Ctrl+F","Ctrl+A","Ctrl+Home","Ctrl+0"], correct: [1], multi: false, fb: "Ctrl+A — A stands for All!" },
  { q: "How do we select two non-contiguous blocks of data?", options: ["Select first block, hold Shift, select second","Select first block, hold Ctrl (Cmd on Mac), select second"], correct: [1], multi: false, fb: "The Ctrl/Cmd key enables selection of non-contiguous data." },
  { q: "How to move to the next cell below after entering data: (Select all that apply)", options: ["Press Enter","Click the cell below","Press Tab","Press Escape"], correct: [0,1], multi: true, fb: "Both Enter and clicking work. Enter is faster for keyboard users." },
  { q: "Which tool keeps headings visible while scrolling?", options: ["Split View","Freeze Panes","Page Layout View","Zoom to Selection"], correct: [1], multi: false, fb: "Freeze Panes keeps selected rows/columns fixed." },
  { q: "To freeze columns A & B and rows 1–4, which cell do you click first?", options: ["A5","B4","C5","C4"], correct: [2], multi: false, fb: "Freeze Panes locks everything above and to the left of the selected cell." },
  { q: "How do you switch between different open workbooks?", options: ["Alt+Tab (Windows only)","View tab → Switch Windows","File → Open Recent","Right-click the taskbar"], correct: [1], multi: false, fb: "View → Switch Windows toggles between open workbooks." },
  { q: "Which will Excel recognize as a date? (Select all that apply)", options: ["05/09/2016","05 Sept 16","05-09-16-2016","Sep.5.16"], correct: [0,1], multi: true, fb: "Excel automatically converts standard date formats." },
  { q: "To clear the contents of a cell without affecting others: (Select all that apply)", options: ["Press the Delete key","Press Backspace then Enter","Right-click → Clear All","Press Ctrl+X"], correct: [0,1], multi: true, fb: "Delete and Backspace+Enter both clear a cell's contents." },
  { q: "Before entering data in an empty cell, must you double-click?", options: ["True","False"], correct: [1], multi: false, fb: "Double-click is only needed when editing existing cell data." },
  { q: "Excel's default alignment when entering data: (Select all that apply)", options: ["Text is aligned left","Numbers are aligned right","Text is aligned right","Numbers are aligned left"], correct: [0,1], multi: true, fb: "Excel auto-aligns text left and numbers right." },
  { q: "What is the main purpose of the fill handle?", options: ["To format cells automatically","To automatically create a series based on existing data","To copy cell formulas only","To delete empty rows"], correct: [1], multi: false, fb: "The fill handle creates series and patterns based on entered data." },
  { q: "What does the cursor look like to activate the fill handle?", options: ["A white arrow","A bold, black plus sign","A four-headed arrow","A hand pointer"], correct: [1], multi: false, fb: "Look for a bold black plus sign in the bottom-right of the active cell." },
  { q: "Columns are referenced using numbers. (True or False)", options: ["True","False"], correct: [1], multi: false, fb: "Columns use letters (A, B, C…); rows use numbers (1, 2, 3…)." },
  { q: "Cells A1 to A20 are all in the same row. (True or False)", options: ["True","False"], correct: [1], multi: false, fb: "A1 to A20 are in the same column (Column A), not the same row." }
];

const RAW_Week2 = [
  { q: "What is the main purpose of the fill handle in Excel?", opts: ["To format cells with colours automatically","To automatically create a series based on existing data","To copy only formulas to adjacent cells","To delete empty rows in a range"], correct: [1], multi: false, cat: "Fill Handle", fb: "The fill handle allows you to create series based on entered data." },
  { q: "What does the mouse cursor look like when you are about to activate the fill handle?", opts: ["A white hollow arrow","A four-headed move arrow","A bold, black plus sign","A hand/pointer icon"], correct: [2], multi: false, cat: "Fill Handle", fb: "Look for a bold black plus sign in the bottom-right corner of the active cell." },
  { q: "How did Sean fill Column D with first names using Flash Fill?", opts: ["He used the AutoFill button on the Data tab","He selected the column and pressed Ctrl+E","He typed 'Christopher' into D2, dragged the fill handle to D7, then used Flash Fill","He copied and pasted names from Column A"], correct: [2], multi: false, cat: "Fill Handle", fb: "Type an example, drag the fill handle, then Flash Fill detects the pattern automatically." },
  { q: "How can you activate Excel's fill functionality? (Select all that apply)", opts: ["Select a range and click the Fill icon on the Home tab","Hover over the small square in the bottom-right of the active cell, then click and drag","Right-click the cell and choose 'Fill Series'","Press Ctrl+D to fill down"], correct: [0,1], multi: true, cat: "Fill Handle", fb: "Both the Fill icon on the Home tab and dragging the fill handle work." },
  { q: "When dragging the fill handle from row 2 to row 6, which of the following shows expected values? (Select all that apply)", opts: ["A3: 5071-2","B3: 2013-05-06","C3: Christopher Schild","D3: 7"], correct: [0,1,2,3], multi: true, cat: "Fill Handle", fb: "Excel recognises patterns in IDs, dates, names, and numbers and fills accordingly." },
  { q: "The large toolbar across the top of Excel is known as the 'Excel bar'. (True or False)", opts: ["True","False"], correct: [1], multi: false, cat: "True / False", fb: "It's called the Ribbon, not the Excel bar." },
  { q: "If the Ribbon is not visible, double-clicking a Ribbon Tab will restore it. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "Double-clicking any ribbon tab toggles it back on." },
  { q: "Columns in Excel are referenced using numbers. (True or False)", opts: ["True","False"], correct: [1], multi: false, cat: "True / False", fb: "Columns use letters (A, B, C…); rows use numbers (1, 2, 3…)." },
  { q: "Rows in Excel are referenced using letters. (True or False)", opts: ["True","False"], correct: [1], multi: false, cat: "True / False", fb: "Rows use numbers, not letters. Columns use letters." },
  { q: "The first cell in Excel is known as '1A'. (True or False)", opts: ["True","False"], correct: [1], multi: false, cat: "True / False", fb: "The first cell is A1 — column letter first, then row number." },
  { q: "Cell B2 is to the right of cell A2. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "Correct — B comes after A, so B2 is directly to the right of A2." },
  { q: "Cells A1 to A20 are all in the same row. (True or False)", opts: ["True","False"], correct: [1], multi: false, cat: "True / False", fb: "A1 to A20 are in the same column (Column A), not the same row." },
  { q: "The Quick Access Toolbar can be customised to include your most-used commands. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "You can add or remove buttons from the Quick Access Toolbar anytime." },
  { q: "Clicking Freeze Panes while cell C3 is selected will freeze the rows above and columns to the left. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "Freeze Panes always locks everything above and to the left of the selected cell." },
  { q: "You can navigate right in a spreadsheet using the scroll bar at the bottom of the screen. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "The horizontal scroll bar at the bottom lets you scroll left and right." },
  { q: "You can type directly into a cell by clicking it once. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "A single click selects a cell and you can start typing immediately." },
  { q: "Pressing Esc will ignore Excel's auto-complete suggestion in the current cell. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "Pressing Esc dismisses Excel's autocomplete suggestion." },
  { q: "Copy and paste in Excel works similarly to how it works in Word. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "The core method is the same (Ctrl+C / Ctrl+V), though the paste options differ." },
  { q: "You can remove information from a cell by highlighting it and pressing the Delete key. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "Delete clears the cell contents without removing formatting." },
  { q: "Clicking Undo (Ctrl+Z) will reverse most recent actions in Excel. (True or False)", opts: ["True","False"], correct: [0], multi: false, cat: "True / False", fb: "Undo is one of the most useful tools — Excel keeps a long history of actions." },
  { q: "How many columns are there in Excel 2007 and later versions?", opts: ["1,024","4,096","16,384","32,768"], correct: [2], multi: false, cat: "Practical Excel", fb: "Excel 2007+ has 16,384 columns (up to column XFD)." },
  { q: "Which of the following is NOT directly available as an option in the Insert tab?", opts: ["Tables","Charts","Columns (as an Insert option)","PivotTables"], correct: [2], multi: false, cat: "Practical Excel", fb: "You insert columns by right-clicking a column header, not from the Insert tab directly." },
  { q: "If you use the fill handle starting from cell A2 which contains '20-Jan-20' and drag down to A15, what date will appear in A15?", opts: ["20-Jan-20","14-Jan-20","02-Feb-20","20-Feb-20"], correct: [2], multi: false, cat: "Practical Excel", fb: "Dragging 13 cells down from 20-Jan adds 13 days, landing on 02-Feb-20." },
  { q: "If B2 contains 30 and B3 contains 33.12, and you drag the fill handle from B2:B3 down to B15, what value will appear in B15?", opts: ["33.12","40.56","43.68","46.80"], correct: [2], multi: false, cat: "Practical Excel", fb: "The pattern increases by 3.12 per step. 30 + (13×3.12) = 70.56, arriving at 43.68." },
  { q: "What value is in cell Q101 on the Orders sheet?", opts: ["7","49","101","17"], correct: [1], multi: false, cat: "Practical Excel", fb: "Navigating to the Orders sheet, cell Q101 contains the value 49." },
  { q: "How many worksheets are in the workbook used in the practical exercise?", opts: ["1","2","3","4"], correct: [2], multi: false, cat: "Practical Excel", fb: "The workbook contains 3 worksheets." },
  { q: "In the 'Sales 2016' sheet, which cell contains the heading 'Qtr4'?", opts: ["D3","E3","F3","E4"], correct: [1], multi: false, cat: "Practical Excel", fb: "The Qtr4 heading is located in cell E3 of the Sales 2016 sheet." },
  { q: "What is the sum of the range B8:E10 in the 'Sales 2016' sheet?", opts: ["48,221.50","50,933.77","53,440.00","47,110.20"], correct: [1], multi: false, cat: "Practical Excel", fb: "Select the range and check the SUM shown in the Status Bar." },
  { q: "What is the average of the non-contiguous ranges B4:B7 and D14:D17 in 'Sales 2016'?", opts: ["4,890.25","5,100.00","5,371.10","5,650.50"], correct: [2], multi: false, cat: "Practical Excel", fb: "Select both ranges using Ctrl, then check the Average in the Status Bar — it shows 5,371.10." },
  { q: "After changing cell C13 to 4,675.24, what is the new value shown in cell C18?", opts: ["60,112.45","61,500.00","62,119.27","63,204.88"], correct: [2], multi: false, cat: "Practical Excel", fb: "C18 recalculates automatically — the new total becomes 62,119.27." }
];

const RAW_Week3 = [
  { q: "What does the A+ / A- button on the Home tab do?", opts: ["Changes the font colour","Increases or decreases the font size of the selected cell","Applies bold formatting","Toggles italic on and off"], correct: [1], multi: false, cat: "Font Formatting", fb: "A+ increases font size and A- decreases it — both adjust incrementally with each click." },
  { q: "Must you select cells before applying font formatting in Excel?", opts: ["True","False"], correct: [0], multi: false, cat: "Font Formatting", fb: "Yes — you must always select the cells first before any formatting is applied." },
  { q: "When choosing a font for a business report, what should you consider? (Select all that apply)", opts: ["Your company's preferred font","Readability","The most decorative font available","Personal preference only"], correct: [0,1], multi: true, cat: "Font Formatting", fb: "Business reports should follow company standards and prioritise readability." },
  { q: "What is the FIRST step when changing the font of an entire spreadsheet?", opts: ["Open the Font dialog box","Click the Home tab","Select all data first","Choose the font from the dropdown"], correct: [2], multi: false, cat: "Font Formatting", fb: "Selection always comes before formatting. Select All (Ctrl+A) first." },
  { q: "Which of the following are appropriate fonts for a professional business report? (Select all that apply)", opts: ["Arial","Comic Sans","Times New Roman","Papyrus"], correct: [0,2], multi: true, cat: "Font Formatting", fb: "Arial and Times New Roman are widely accepted industry-standard fonts." },
  { q: "Can you add borders to a large dataset by selecting just one cell?", opts: ["True","False"], correct: [1], multi: false, cat: "Borders", fb: "False — you must select all the cells you want to border before applying." },
  { q: "Which border option adds a single line at the top and a double line at the bottom?", opts: ["Outside Borders","Thick Box Border","Top and Double Bottom Border","All Borders"], correct: [2], multi: false, cat: "Borders", fb: "'Top and Double Bottom Border' places a single top line and a double bottom line." },
  { q: "What is the safest way to remove borders from cells without changing any data?", opts: ["Press Delete","Go to Borders → No Borders","Clear All from the Editing menu","Use Ctrl+Z to undo"], correct: [1], multi: false, cat: "Borders", fb: "Borders → No Borders removes only the border formatting, leaving all cell data untouched." },
  { q: "Which tool is used to centre a heading across multiple columns in Excel?", opts: ["Center Align","Indent","Merge and Centre","Text Wrap"], correct: [2], multi: false, cat: "Alignment", fb: "Merge and Centre combines the selected cells into one and centres the content horizontally." },
  { q: "A cell is formatted with Horizontal: Center and Vertical: Top alignment. Where does the text appear?", opts: ["Centred horizontally, at the bottom of the cell","Centred horizontally, at the top of the cell","Left-aligned at the top","Right-aligned in the middle"], correct: [1], multi: false, cat: "Alignment", fb: "Horizontal: Center → middle left-to-right; Vertical: Top → at the top of the cell." },
  { q: "Text is cut off in a cell. What is the best way to display it fully without affecting the column layout?", opts: ["Widen the column manually","Delete some text","Click 'Wrap Text'","Merge with the next cell"], correct: [2], multi: false, cat: "Alignment", fb: "Wrap Text makes the row taller to show all the content within the existing column width." },
  { q: "Which of the following does Format Painter copy? (Select all that apply)", opts: ["Font type","Cell background fill","Text alignment","Number format","Borders","Font size"], correct: [0,1,2,3,4,5], multi: true, cat: "Format Painter", fb: "Format Painter copies ALL formatting: font type and size, fill colour, alignment, number format, and borders." },
  { q: "How do you use Format Painter to apply formatting from one worksheet to an entire other worksheet?", opts: ["Copy one cell and paste special on the new sheet","Select entire worksheet → click Format Painter → click cell A1 in the new worksheet","Right-click the sheet tab and choose 'Copy Format'","Use Ctrl+Shift+V on the new sheet"], correct: [1], multi: false, cat: "Format Painter", fb: "Select All on the source sheet, click Format Painter, then click A1 on the destination sheet." },
  { q: "What are 'banded rows' and how are they created in Excel?", opts: ["Rows grouped by value using conditional formatting","Alternating row colours for readability; manually fill one row, leave the next blank, use Format Painter","Frozen rows that stay visible while scrolling","Rows that automatically resize based on content"], correct: [1], multi: false, cat: "Format Painter", fb: "Banded rows alternate shading colours for readability. Format Painter makes it easy to copy the pattern down." },
  { q: "When you select a range and choose the first option from the Clear drop-down, what gets cleared?", opts: ["All cell content and formatting","Only the cell values","Only the number formatting from the data","Only the font colour"], correct: [2], multi: false, cat: "Format Painter", fb: "'Clear Formats' removes number formatting but keeps the actual cell values intact." },
  { q: "Cells D4:D10 display values like 12.5%, 8.3%, 15.0%. What number format has been applied?", opts: ["General","Currency","Percentage with 1 decimal place","Fraction"], correct: [2], multi: false, cat: "Number Formatting", fb: "Percentage with 1 decimal place formats numbers as percentages showing one digit after the decimal." },
  { q: "Column B displays dates including the full weekday name, e.g. 'Monday, 14 January 2019'. What format is applied?", opts: ["Short Date","Medium Date","Long Date","Custom Date"], correct: [2], multi: false, cat: "Number Formatting", fb: "The Long Date format includes the full day name and month name alongside the day number and year." },
  { q: "What is the main visual difference between the Accounting and Currency number formats?", opts: ["Accounting uses a comma; Currency uses a decimal","Currency shows two decimal places; Accounting shows none","Accounting aligns the currency symbol to the left edge of the cell","Currency is only for whole numbers"], correct: [2], multi: false, cat: "Number Formatting", fb: "Accounting format left-aligns the £/$ symbol at the cell edge — Currency keeps the symbol next to the number." },
  { q: "Can Cell Style colours only be changed using Excel's preset built-in themes?", opts: ["True","False"], correct: [1], multi: false, cat: "Themes & Cell Styles", fb: "False — you can create fully custom theme colours using 'Create New Theme Colors'." },
  { q: "If you choose a different Excel theme, does it override ALL previously applied formatting?", opts: ["True","False"], correct: [1], multi: false, cat: "Themes & Cell Styles", fb: "False — themes only affect cells using theme-based colours. Custom formatting is unaffected." },
  { q: "Does changing the theme in Excel affect all worksheets in the same workbook?", opts: ["True","False"], correct: [0], multi: false, cat: "Themes & Cell Styles", fb: "True — a theme is applied at the workbook level, so it changes the look of all sheets simultaneously." },
  { q: "You click on cell B2 but Excel activates cell A1 instead. Why does this happen?", opts: ["B2 is protected and cannot be selected","A1 and B2 have been merged into one cell","There is a formula in A1 referencing B2","The sheet is in Read-Only mode"], correct: [1], multi: false, cat: "Practical Task", fb: "When cells are merged, clicking any part of the merged range activates the top-left cell." },
  { q: "Looking at the spreadsheet heading in Row 1, which font has been applied?", opts: ["Calibri","Arial","Candara","Georgia"], correct: [2], multi: false, cat: "Practical Task", fb: "The heading uses the Candara font — check the Font box on the Home tab when the heading cell is selected." },
  { q: "Which alignment option has been applied to the heading in Row 1?", opts: ["Centre Align","Wrap Text","Merge and Center","Top Align"], correct: [2], multi: false, cat: "Practical Task", fb: "Merge and Center combines the heading cells and centres the text." },
  { q: "Which formatting options have been applied to cell A3? (Select all that apply)", opts: ["Bold","Italics","Middle Align","Underline","Wrap Text"], correct: [0,1,2], multi: true, cat: "Practical Task", fb: "Cell A3 has Bold, Italics, and Middle Align applied." },
  { q: "Cell B3 uses the Long Date format. What day of the week does the date fall on?", opts: ["Sunday","Monday","Tuesday","Wednesday"], correct: [1], multi: false, cat: "Practical Task", fb: "When the Long Date format is applied to the date in B3, it displays 'Monday'." },
  { q: "Cell T10 currently shows an incorrect number. After correcting the number format, what value should it display?", opts: ["6%","60%","600%","0.60%"], correct: [1], multi: false, cat: "Practical Task", fb: "The corrected number format in T10 should display 60%." },
  { q: "Which Cell Style has been applied to the range C38:U38 (the totals row)?", opts: ["Heading 1","Good","Total","Calculation"], correct: [2], multi: false, cat: "Practical Task", fb: "The 'Total' Cell Style has been applied to the range C38:U38." },
  { q: "What border format has been added to cell B3?", opts: ["All Borders","Thick Box Border","Thick Bottom Border","Top and Double Bottom Border"], correct: [2], multi: false, cat: "Practical Task", fb: "A Thick Bottom Border has been applied to B3." },
  { q: "What text orientation has been applied to the column headings in D6:T6?", opts: ["Rotate Text Down","Angle Counterclockwise","Rotate Text Up","Vertical Text"], correct: [2], multi: false, cat: "Practical Task", fb: "'Rotate Text Up' has been applied to D6:T6 — this tilts the text upward at 90°." },
  { q: "What vertical alignment has been applied to cell U31?", opts: ["Top Align","Bottom Align","Middle Align","Justify"], correct: [2], multi: false, cat: "Practical Task", fb: "Middle Align has been applied to U31." },
  { q: "After increasing the decimal places in cell S38 to 3, what value is displayed?", opts: ["30.8","30.86","30.867","30.8670"], correct: [2], multi: false, cat: "Practical Task", fb: "Increasing decimal places to 3 in S38 reveals the value 30.867." }
];

const RAW_Formulas = [
  { q: "A cell A1 contains 10 and A2 contains 2. What formula was entered in cell A3 to divide A1 by A2?", opts: ["=A1*A2","=A1/A2","=A1+A2","=A1-A2"], correct: [1], multi: false, cat: "Operators", fb: "=A1/A2 divides the value in A1 by A2. The / symbol is used for division in Excel." },
  { q: "If A1=6, A2=3, A3=2 — which formula will NOT give the result 2?", opts: ["=A1/A2","=A1/A3","=A1-A2/A3","=A2/A2*A2/A3"], correct: [2], multi: false, cat: "Operators", fb: "=A1-A2/A3 evaluates as 6-(3/2)=4.5, not 2. Division happens before subtraction." },
  { q: "What is the result of the formula =7+3+4 in Excel?", opts: ["10","11","14","21"], correct: [2], multi: false, cat: "Operators", fb: "7+3+4 = 14. Simple addition — Excel calculates left to right." },
  { q: "An item is purchased at $10 (cell A2) and sold at $29.99 (cell B2). Which formula gives the profit?", opts: ["=A2+B2","=B2-A2","=A2*B2","=B2/A2"], correct: [1], multi: false, cat: "Writing Formulas", fb: "Profit = Sale Price − Purchase Price, so =B2-A2 is correct." },
  { q: "A product costs $3,296.99 (A2) and a 5% discount rate is in B2. Which formula calculates the discount amount?", opts: ["=A2*5","=A2/B2","=A2*B2","=A2*B2/100"], correct: [3], multi: false, cat: "Writing Formulas", fb: "=A2*B2/100 multiplies the cost by the percentage value to get the discount amount." },
  { q: "Base salary is in A2, commission in B2, and tax rate in C2. Which formula correctly calculates tax owed?", opts: ["=A2*C2+B2","=A2+B2+C2","=(A2+B2)*C2","=A2*B2*C2"], correct: [2], multi: false, cat: "Writing Formulas", fb: "=(A2+B2)*C2 adds salary and commission first, then multiplies by the tax rate." },
  { q: "Which is the correct formula to add all cells from B3 to B6?", opts: ["=SUM(B3,B6)","=SUM(B3+B6)","=SUM(B3:B6)","=ADD(B3:B6)"], correct: [2], multi: false, cat: "SUM & AutoSum", fb: "The colon (:) defines a range in Excel. =SUM(B3:B6) adds all cells from B3 through B6." },
  { q: "Do you need to type '=' before pressing AutoSum on the Home tab?", opts: ["Yes, always start with =","No — AutoSum inserts the = automatically","Only for large ranges","Only if the cells contain text"], correct: [1], multi: false, cat: "SUM & AutoSum", fb: "AutoSum automatically inserts the = sign and the SUM formula — you don't need to type anything first." },
  { q: "Cell D2 has the formula =SUM(A2:C2). After copying it down to D4, what formula appears in D4?", opts: ["=SUM(A2:C2)","=SUM(A3:C3)","=SUM(A4:C4)","=SUM(A2:C4)"], correct: [2], multi: false, cat: "SUM & AutoSum", fb: "Relative references shift automatically. Copying down 2 rows turns A2:C2 into A4:C4." },
  { q: "Which formula correctly calculates the average of cells A3 to A9?", opts: ["=AVG(A3:A9)","=AVERAGE(A3,A9)","=AVERAGE(A3:A9)","=MEAN(A3:A9)"], correct: [2], multi: false, cat: "AVERAGE / MIN / MAX", fb: "=AVERAGE(A3:A9) is the correct syntax. Use a colon for ranges." },
  { q: "Range A2:A5 contains the values 4, 7, 9, 6. Which function returns 4?", opts: ["=MAX(A2:A5)","=AVERAGE(A2:A5)","=MIN(A2:A5)","=SUM(A2:A5)"], correct: [2], multi: false, cat: "AVERAGE / MIN / MAX", fb: "=MIN(A2:A5) returns the lowest value in the range, which is 4." },
  { q: "Range A2:A5 contains the values 4, 7, 9, 6. Which function returns 9?", opts: ["=MIN(A2:A5)","=MAX(A2:A5)","=AVERAGE(A2:A5)","=COUNT(A2:A5)"], correct: [1], multi: false, cat: "AVERAGE / MIN / MAX", fb: "=MAX(A2:A5) returns the highest value in the range, which is 9." },
  { q: "What is the correct way to write cell A1 as an absolute reference?", opts: ["A$1","$A1","$A$1","@A@1"], correct: [2], multi: false, cat: "Absolute References", fb: "$A$1 locks both the column (A) and the row (1), making it fully absolute." },
  { q: "Which keyboard shortcut toggles a cell reference between relative, mixed, and absolute in Excel (Windows)?", opts: ["F2","F3","F4","F5"], correct: [2], multi: false, cat: "Absolute References", fb: "F4 (Cmd+T on Mac) cycles through reference types: A1 → $A$1 → A$1 → $A1 → A1." },
  { q: "A discount rate is in cell D2. When copying a discount formula down, which formula keeps D2 fixed?", opts: ["=D2*A2","=$D2*A2","=$D$2*A2","=D$2*A2"], correct: [2], multi: false, cat: "Absolute References", fb: "=$D$2*A2 uses an absolute reference for D2 so it stays fixed while A2 adjusts." },
  { q: "Do you need to copy values from another worksheet before using them in a formula?", opts: ["Yes, always copy first","No — you can reference other sheets directly in formulas","Only if the sheets are in different workbooks","Only for SUM formulas"], correct: [1], multi: false, cat: "Cross-Sheet References", fb: "Excel lets you reference any cell in any sheet directly using SheetName!CellRef syntax." },
  { q: "What does the formula =Sheet1!A2*A2 do when entered in Sheet2?", opts: ["Squares the value in A2 from Sheet1","Multiplies A2 from Sheet1 by A2 in the current sheet","Adds A2 from Sheet1 to A2 in the current sheet","Copies the value from Sheet1 A2 into the current cell"], correct: [1], multi: false, cat: "Cross-Sheet References", fb: "Sheet1!A2 refers to cell A2 on Sheet1. Multiplied by A2 (current sheet) combines both values." },
  { q: "Can you use relative references when copying formulas across worksheets in Excel?", opts: ["No — only absolute references work across sheets","Yes — relative references adjust based on position","Only in the same workbook","Only with the SUM function"], correct: [1], multi: false, cat: "Cross-Sheet References", fb: "Relative references work across sheets just like within a single sheet — they adjust when copied." },
  { q: "Using the formula Hours × Rate for Base Pay, what is Sandy Smith's Base Pay?", opts: ["$980.00","$1,100.50","$1,184.00","$1,250.00"], correct: [2], multi: false, cat: "Payroll Practical", fb: "Sandy Smith's Hours × Rate gives a Base Pay of $1,184.00." },
  { q: "Using Base Pay × Commission Rate (from J3) for Commission, what is Diepak Kumar's Commission?", opts: ["$28.50","$39.90","$45.20","$51.00"], correct: [1], multi: false, cat: "Payroll Practical", fb: "Diepak Kumar's Base Pay × the Commission Rate in J3 = $39.90." },
  { q: "Using Base Pay + Commission for Gross Pay, what is Steve Welgemoed's Gross Pay?", opts: ["$389.10","$399.00","$409.34","$425.00"], correct: [2], multi: false, cat: "Payroll Practical", fb: "Steve Welgemoed's Base Pay + Commission = $409.34 Gross Pay." },
  { q: "Using Gross Pay × Tax Rate (from J4) for Tax, what is Diepak Kumar's Tax amount?", opts: ["$245.30","$270.00","$290.47","$310.20"], correct: [2], multi: false, cat: "Payroll Practical", fb: "Diepak Kumar's Gross Pay × Tax Rate (J4) = $290.47." },
  { q: "Using Gross Pay − Tax for Net Pay, what is Steve Welgemoed's Net Pay?", opts: ["$275.00","$284.50","$294.73","$305.10"], correct: [2], multi: false, cat: "Payroll Practical", fb: "Steve Welgemoed's Gross Pay − Tax = $294.73 Net Pay." },
  { q: "What is the Total Gross Pay when totalling row 14 across columns F to J?", opts: ["$4,985.00","$5,150.22","$5,358.39","$5,500.00"], correct: [2], multi: false, cat: "Payroll Practical", fb: "The SUM of F14:J14 gives a Total Gross Pay of $5,358.39." },
  { q: "What is the Average Commission shown in row 16 (columns F to J)?", opts: ["$28.10","$31.50","$34.35","$37.00"], correct: [2], multi: false, cat: "Payroll Practical", fb: "The AVERAGE of the commission values in row 16 = $34.35." },
  { q: "What is the Maximum Gross Pay shown in row 17 (columns F to J)?", opts: ["$1,100.00","$1,175.50","$1,231.36","$1,290.00"], correct: [2], multi: false, cat: "Payroll Practical", fb: "The MAX of Gross Pay values in row 17 = $1,231.36." },
  { q: "What is the Minimum Tax shown in row 18 (columns F to J)?", opts: ["$98.40","$107.20","$114.62","$121.00"], correct: [2], multi: false, cat: "Payroll Practical", fb: "The MIN of Tax values in row 18 = $114.62." },
  { q: "On the Branch Summary worksheet, what is the Total Gross Pay for Sandown?", opts: ["$2,980.50","$3,150.00","$3,337.88","$3,500.00"], correct: [2], multi: false, cat: "Payroll Practical", fb: "Using SUM with cross-sheet references, Sandown's Total Gross Pay = $3,337.88." }
];

const RAW_Week4 = [
  { q: "Which of the following are valid ways to insert a column to the LEFT of an existing column? (Select all that apply)", opts: ["Right-click the column header → Insert","Home tab → Insert → Insert Sheet Columns","Press Ctrl+Plus on the keyboard after selecting the column","Double-click the column border"], correct: [0,1], multi: true, cat: "Insert & Delete", fb: "Both right-clicking the column header and using the Home tab Insert menu work." },
  { q: "Sean tries to delete the contents of cells O3, O4, P3 and P4 by right-clicking and choosing 'Delete'. What went wrong? (Select all that apply)", opts: ["He is mixing up deleting cell content vs. deleting entire cells","Better to use Home tab → Clear → Clear Contents","He should use Ctrl+Z to undo first","He should use the Delete key on the keyboard after selecting those cells"], correct: [0,1], multi: true, cat: "Insert & Delete", fb: "Right-click → Delete removes the cells. Clear Contents only removes the data, leaving the cells in place." },
  { q: "Robert Demarko needs to be added while keeping the list in alphabetical order. Which methods correctly insert a row? (Select all that apply)", opts: ["Press Ctrl+Shift+= while in row 10","Home tab → Insert Sheet Rows","Right-click Row 10 → Insert","Press Ctrl+D in row 10"], correct: [0,1,2], multi: true, cat: "Insert & Delete", fb: "Keyboard shortcut Ctrl+Shift+=, the Home tab, and right-clicking the row number all correctly insert a new row." },
  { q: "Why did Sean use the full street address in Find & Replace instead of just the city name 'Sydney'?", opts: ["Excel requires a full address for Find & Replace to work","To avoid accidentally changing all other instances of 'Sydney' across the database","Full addresses search faster in large datasets","Sydney is a reserved keyword in Excel"], correct: [1], multi: false, cat: "Find & Replace", fb: "Using the full address makes the search precise, preventing unintended replacements." },
  { q: "What are the correct Find & Replace settings to find ALL lowercase instances of 'with' across the entire workbook? (Select all that apply)", opts: ["Find what: with","Within: Workbook","Match case","Look in: Values","Find what: With"], correct: [0,1,2,3], multi: true, cat: "Find & Replace", fb: "'Find what: with' + Within: Workbook + Match case + Look in: Values ensure only lowercase 'with' is found." },
  { q: "You are searching for '18' in street addresses but getting too many results. Which methods help narrow the search? (Select all that apply)", opts: ["Use Format settings to match a specific cell format","Select Column D (Address) before searching","Enable 'Match entire cell contents'","Change Within to Sheet"], correct: [0,1], multi: true, cat: "Find & Replace", fb: "Setting a Format filter and pre-selecting the Address column both restrict where Excel looks." },
  { q: "What does a funnel/filter icon appearing on a column header indicate?", opts: ["The column is sorted A to Z","A filter is currently applied to that column","The column is locked and cannot be edited","AutoFilter has been turned off"], correct: [1], multi: false, cat: "Filtering", fb: "The funnel icon is Excel's visual cue that an active filter is applied to that column." },
  { q: "Which of the following are valid filter arguments for a date column in Excel? (Select all that apply)", opts: ["Weekdays only","Tomorrow","Does not equal","Greater than 100","Contains text"], correct: [0,1,2], multi: true, cat: "Filtering", fb: "Excel's date filter options include Weekdays, Tomorrow, and Does Not Equal." },
  { q: "Why is it important to clear filters after you have finished using them? (Select all that apply)", opts: ["Filters can hide rows and mislead further analysis","Filters persist even when columns are hidden","Filters permanently delete the hidden rows","Clearing filters speeds up Excel significantly"], correct: [0,1], multi: true, cat: "Filtering", fb: "Active filters hide data silently and persist even if columns are hidden, causing serious errors." },
  { q: "How can you tell whether a filter is currently applied to a dataset?", opts: ["The row numbers turn blue and some are missing","A funnel icon appears in the column header","The sheet tab changes colour","The status bar shows 'Filter Active'"], correct: [1], multi: false, cat: "Filtering", fb: "A funnel icon in the column header — replacing the normal drop-down arrow — indicates an active filter." },
  { q: "Sean selected only the 'Order Quantity' column before sorting. What went wrong?", opts: ["Excel refused to sort a single column","Only that column's values were rearranged — the rest stayed in original order, causing data misalignment","Excel sorted all columns automatically","The sort applied only to the first 100 rows"], correct: [1], multi: false, cat: "Sorting", fb: "Sorting a single column without selecting the whole dataset breaks the relationship between columns." },
  { q: "What should you do before sorting a messy dataset to ensure accurate results? (Select all that apply)", opts: ["Ensure consistent number formats across the column","Add clear headers to each column","Remove all filters first","Convert the data to a Table"], correct: [0,1], multi: true, cat: "Sorting", fb: "Consistent formats prevent mixed-type sorting errors, and headers help Excel identify where data begins." },
  { q: "You are sorting an 'Order Priority' column with Low, Medium, High, and Critical. What issue arises with a standard A-to-Z sort?", opts: ["Excel cannot sort text columns","Excel sorts alphabetically, so Critical → High → Low → Medium, not by logical priority","The sort ignores capitalised words","Only the top 100 rows are sorted"], correct: [1], multi: false, cat: "Sorting", fb: "Excel sorts text alphabetically, not logically. You'd need a Custom Sort to fix this." },
  { q: "When sorting text in ascending order, what does Excel produce?", opts: ["Z to A","Numbers before letters","A to Z","Most recent to oldest"], correct: [2], multi: false, cat: "Sorting", fb: "Ascending order for text means A to Z — the smallest/earliest value first." },
  { q: "What can Conditional Formatting be used for in Excel? (Select all that apply)", opts: ["Identify trends, variances, and similarities in data","Visualise data behaviour with colour scales or icon sets","Automatically highlight cells based on set conditions","Sort the data by colour","Delete cells that don't meet a condition"], correct: [0,1,2], multi: true, cat: "Conditional Formatting", fb: "Conditional Formatting highlights and flags cells based on rules — it never sorts or deletes data." },
  { q: "Can you apply Conditional Formatting by clicking on any single cell in the dataset?", opts: ["True","False"], correct: [1], multi: false, cat: "Conditional Formatting", fb: "False — you must first select the specific range of cells you want to format." },
  { q: "You need to highlight all 'Critical' cells in the Order Priority column with Yellow Fill. Which approaches work? (Select all that apply)", opts: ["Select the range → Highlight Cell Rules → Equal To → type 'Critical'","Select the range → Highlight Cell Rules → Text that Contains → type 'Critical'","Select the range → New Rule → Use a formula","Select the cell → Format Cells → Fill → Yellow"], correct: [0,1], multi: true, cat: "Conditional Formatting", fb: "Both 'Equal To' and 'Text that Contains' rules work for exact matching of 'Critical'." },
  { q: "You need to insert 3 new columns at once. Which methods work? (Select all that apply)", opts: ["Click the Insert button on the Home tab 3 times individually","Select 3 existing columns → Right-click → Insert","Press Ctrl+Shift+= three times","Use Data tab → Insert Columns"], correct: [0,1], multi: true, cat: "Practical Task", fb: "Clicking Insert 3 times and selecting 3 columns before right-clicking both insert 3 columns." },
  { q: "What is the fastest way to apply the same Conditional Formatting from one column to another?", opts: ["Re-create the rule from scratch on the new column","Copy the column → Paste Special → Formats","Use Format Painter","Go to Manage Rules and copy the rule"], correct: [2], multi: false, cat: "Practical Task", fb: "Format Painter is the quickest method — click the formatted column, then click Format Painter." },
  { q: "After unhiding the hidden columns, what is the Product Name for order number 5023-1?", opts: ["Binders","Envelopes","Pencils","Staplers"], correct: [2], multi: false, cat: "Practical Task", fb: "Unhiding the columns reveals that order 5023-1 is for Pencils." },
  { q: "After deleting row 11, what is the updated average displayed in cell S1?", opts: ["1,134.20","1,148.75","1,156.53","1,170.00"], correct: [2], multi: false, cat: "Practical Task", fb: "With row 11 removed, the AVERAGE formula in S1 recalculates to 1,156.53." },
  { q: "After sorting by Ship Date to find the most recent shipment, what is the Order Quantity of that shipment?", opts: ["14","22","31","45"], correct: [2], multi: false, cat: "Practical Task", fb: "Sorting by Ship Date descending reveals the most recent shipment had an Order Quantity of 31." },
  { q: "After filtering for the most recent furniture item, what is the Customer Type for that order?", opts: ["Consumer","Small Business","Home Office","Corporate"], correct: [3], multi: false, cat: "Practical Task", fb: "Filtering by Category = Furniture and sorting by date shows the most recent belongs to a Corporate customer." },
  { q: "After filtering for Cindy Chapman's orders managed by Tina Carlton, how many orders are there?", opts: ["3","4","6","8"], correct: [2], multi: false, cat: "Practical Task", fb: "Filtering by Customer = Cindy Chapman and Account Manager = Tina Carlton returns 6 matching orders." },
  { q: "How many orders have Customer Type = Home Office, Account Manager = Leighton Forrest, AND Order Priority = High?", opts: ["1","2","3","5"], correct: [2], multi: false, cat: "Practical Task", fb: "Applying all three filters — Home Office + Leighton Forrest + High Priority — returns exactly 3 orders." },
  { q: "How many Office Supplies orders have a Total value over $7,000?", opts: ["2","3","4","5"], correct: [3], multi: false, cat: "Practical Task", fb: "Filtering by Category = Office Supplies and then applying a number filter (Total > 7000) shows 5 matching orders." },
  { q: "After using Conditional Formatting to highlight the Top 1% of orders by value, what is the Average Order Quantity shown in cell M1043?", opts: ["38","42","46","50"], correct: [2], multi: false, cat: "Practical Task", fb: "The correct average for the Top 1% orders is 46." },
  { q: "Using Find & Replace to locate order number 6044-1, what is the Order Quantity for that order?", opts: ["18","22","26","31"], correct: [2], multi: false, cat: "Practical Task", fb: "Finding order 6044-1 reveals an Order Quantity of 26." },
  { q: "After using Find & Replace to change 'Tina Carlton' to 'Tina Shaw' across the entire workbook, how many replacements were made?", opts: ["98","115","137","142"], correct: [2], multi: false, cat: "Practical Task", fb: "Excel confirms 137 replacements were made when replacing 'Tina Carlton' with 'Tina Shaw'." }
];

const RAW_Week5 = [
  { q: "What is the correct way to open Print Preview in Excel?", opts: ["Press Ctrl+P and wait","File tab → Print (Backstage View)","View tab → Print Preview","Right-click the sheet tab → Print Preview"], correct: [1], multi: false, cat: "Print Preview", fb: "File tab → Print opens Backstage View, which shows a live print preview on the right side." },
  { q: "The Print Preview shows '1 of 105'. How many pages will print?", opts: ["1","10","105","It depends on the printer"], correct: [2], multi: false, cat: "Print Preview", fb: "The preview clearly shows '1 of 105', meaning the entire workbook will print across 105 pages." },
  { q: "Which of the following actions can reduce the number of printed pages for a wide worksheet? (Select all that apply)", opts: ["Use narrower margins","Fit all columns on one page","Change to Landscape orientation","Increase the font size","Add more columns"], correct: [0,1,2], multi: true, cat: "Print Preview", fb: "Narrower margins, fitting columns to one page, and switching to Landscape all reduce page count." },
  { q: "Where is the icon to switch to Page Layout View located?", opts: ["Home tab → Views group","Insert tab → Pages group","View tab → Workbook Views section","Page Layout tab → Sheet Options"], correct: [2], multi: false, cat: "Page Layout View", fb: "The Page Layout View icon is in the Workbook Views section on the VIEW tab." },
  { q: "A screenshot shows data surrounded by ruler guides, page margins, and a header/footer area. Which view is this?", opts: ["Normal View","Page Break Preview","Page Layout View","Print Preview"], correct: [2], multi: false, cat: "Page Layout View", fb: "Page Layout View displays data exactly as it will appear on the printed page." },
  { q: "What is the main purpose of Page Layout View?", opts: ["To freeze rows and columns for easier scrolling","To filter and sort data before printing","To show how data will look on a printed page","To compare two worksheets side by side"], correct: [2], multi: false, cat: "Page Layout View", fb: "Page Layout View lets you see and adjust the printed layout — margins, headers, footers, and page breaks." },
  { q: "How do you centre the print selection horizontally on the page?", opts: ["Home tab → Alignment → Centre","View tab → Page Layout → Centre","Page Layout tab → Margins → Custom Margins → Centre on page","File tab → Print → Centre Horizontally"], correct: [2], multi: false, cat: "Page Layout View", fb: "Go to Page Layout tab → Margins → Custom Margins, then tick 'Horizontally' under 'Centre on page'." },
  { q: "Where do you go to manually insert a Page Break in Excel?", opts: ["Home tab → Cells → Insert","Insert tab → Page Break","Page Layout tab → Breaks","View tab → Page Break Preview → Insert"], correct: [2], multi: false, cat: "Page Breaks", fb: "Page Layout tab → Breaks gives you Insert Page Break, Remove Page Break, and Reset All Page Breaks." },
  { q: "The active cell is D5. What happens when you click Insert Page Break?", opts: ["Only a horizontal break is added above row 5","Only a vertical break is added to the left of column D","A vertical break is added to the left of column D AND a horizontal break above row 5","A break is added at the end of the current page"], correct: [2], multi: false, cat: "Page Breaks", fb: "When a cell inside the sheet is selected, Excel inserts BOTH a horizontal and a vertical break." },
  { q: "What happens when you manually drag a page break line in Page Break Preview? (Select all that apply)", opts: ["The appearance of the break line changes (solid to dotted or vice versa)","The number of columns on the page may change","The scale of the page may adjust automatically","All data beyond the break is permanently deleted","The sheet is split into a new workbook"], correct: [0,1,2], multi: true, cat: "Page Breaks", fb: "Dragging a page break changes the line style, redistributes columns, and may adjust print scale." },
  { q: "How do you make column headings repeat on every printed page?", opts: ["Freeze the top row using View → Freeze Panes","Copy the heading row to every page manually","Page Layout tab → Print Titles → define Rows to repeat at top","Insert tab → Header → Repeat Headings"], correct: [2], multi: false, cat: "Print Titles", fb: "Page Layout tab → Print Titles lets you specify rows or columns that will repeat on every printed page." },
  { q: "What is the key difference between Freeze Panes and Print Titles?", opts: ["Freeze Panes works in all versions; Print Titles only in Excel 365","Freeze Panes locks rows on screen while scrolling; Print Titles repeats rows/columns on every printed page","Print Titles is faster to apply than Freeze Panes","They are the same feature with different names"], correct: [1], multi: false, cat: "Print Titles", fb: "Freeze Panes only affects the screen. Print Titles only affects the printed output. They serve different purposes." },
  { q: "Based on the Page Setup settings shown, what will the printout include? (Select all that apply)", opts: ["Gridlines will be printed","Columns A and B will repeat on each page","Row numbers and column letters will be printed","The sheet will print in black and white only"], correct: [0,1], multi: true, cat: "Print Titles", fb: "The Page Setup shows both 'Gridlines' and 'Columns to repeat at left' (A and B) have been configured." },
  { q: "Which view allows you to click directly into the header or footer area to edit it?", opts: ["Normal View","Page Break Preview","Page Layout View","Print Preview"], correct: [2], multi: false, cat: "Headers & Footers", fb: "Page Layout View shows the physical header and footer zones. Click into either area to activate the Design tab." },
  { q: "What makes a page header different from a worksheet heading typed in row 1? (Select all that apply)", opts: ["A page header appears automatically on every single printed page","A page header lets you add metadata such as company name, author, or date","A page header is part of the spreadsheet data","A page header can only contain text, not numbers"], correct: [0,1], multi: true, cat: "Headers & Footers", fb: "Page headers repeat on every printed page and are designed for metadata. They are NOT part of the data." },
  { q: "How do you access the Design tab to edit header and footer content?", opts: ["Go to Insert tab → Header & Footer → Design","Click the Design tab from the main ribbon at any time","Click inside the Header or Footer area in Page Layout View to activate the Design tab","Right-click the header area and choose 'Design'"], correct: [2], multi: false, cat: "Headers & Footers", fb: "The Header & Footer Design tab only appears when your cursor is inside the header or footer zone." },
  { q: "According to the Print Preview, how many pages will the worksheet print on?", opts: ["1","2","3","5"], correct: [2], multi: false, cat: "Practical Task", fb: "The Print Preview confirms the worksheet will print across 3 pages with the current settings." },
  { q: "Which margin setting is currently selected for this worksheet?", opts: ["Narrow","Normal","Wide","Custom"], correct: [1], multi: false, cat: "Practical Task", fb: "The Normal margin setting is selected — this applies Excel's standard default margin spacing." },
  { q: "Which page orientation is currently selected?", opts: ["Portrait","Landscape","Custom","Automatic"], correct: [1], multi: false, cat: "Practical Task", fb: "Landscape orientation is selected — ideal for wide datasets." },
  { q: "Has a custom scale been applied to this worksheet?", opts: ["True","False"], correct: [0], multi: false, cat: "Practical Task", fb: "True — a custom scale has been applied to the print output." },
  { q: "How many manual page breaks have been added to split this worksheet into 3 printed pages?", opts: ["1","2","3","4"], correct: [1], multi: false, cat: "Practical Task", fb: "To create 3 pages you need 2 page breaks — one fewer than the number of pages." },
  { q: "You need to insert a page break between rows 20 and 21. Which cell should you click before inserting the break?", opts: ["A20","A21","B20","B21"], correct: [1], multi: false, cat: "Practical Task", fb: "You always click the cell BELOW where you want the break. Clicking A21 inserts a break above row 21." },
  { q: "What has been added to the footer of this worksheet?", opts: ["The sheet name","The file path","A page number","The author's name"], correct: [2], multi: false, cat: "Practical Task", fb: "A page number has been added to the footer, centred — the most common footer element." },
  { q: "The first four rows are set to repeat on every printed page via Print Titles. How do you stop them from repeating?", opts: ["Delete the first four rows","Turn off Freeze Panes","Go to Print Titles settings and clear the 'Rows to repeat at top' field","Use Ctrl+Z to undo the Print Titles setting"], correct: [2], multi: false, cat: "Practical Task", fb: "Go to Page Layout tab → Print Titles and delete the row reference to remove the repeating rows." },
  { q: "You insert a new column between columns C and D. What effect does this have on the current print settings?", opts: ["The page orientation changes to Portrait","The margin setting resets to Normal","The custom scaling adjusts to accommodate the extra column","Nothing changes — print settings are unaffected"], correct: [2], multi: false, cat: "Practical Task", fb: "Adding a column changes the width of the data, so Excel recalculates the custom scaling." },
  { q: "What must you do BEFORE manually changing the custom scale percentage on a worksheet?", opts: ["Save the workbook first","Set the Page Width to Automatic","Clear all page breaks","Switch to Normal View"], correct: [1], multi: false, cat: "Practical Task", fb: "You must set the Page Width (and/or Height) to Automatic first — otherwise the Fit to Page setting overrides." }
];

const RAW_Week6 = [
  { q: "Where do you find the chart creation tools in Excel?", opts: ["Home tab → Charts group","Insert tab → Charts group","View tab → Charts group","Data tab → Charts group"], correct: [1], multi: false, cat: "Creating Charts", fb: "Charts are created from the INSERT tab → Charts group. Select your data first." },
  { q: "What is the best practice BEFORE creating a chart in Excel?", opts: ["Insert a blank chart and then link data","Select your data and column/row headers first","Create the chart on a new sheet, then add data","Format your cells before selecting data"], correct: [1], multi: false, cat: "Creating Charts", fb: "Always select your data including headers before creating a chart." },
  { q: "Sean tried to create a pie chart but Charlie Bui's record didn't appear. What went wrong?", opts: ["Pie charts cannot display names","He used the wrong colour scheme","He selected too many columns — pie charts can only handle one data series","His data had duplicate entries"], correct: [2], multi: false, cat: "Creating Charts", fb: "Pie charts only support a single data series. Selecting multiple data columns causes some data to be excluded." },
  { q: "Sean's column chart looks wrong — Excel treated Qtr1-Qtr4 headers as dates instead of labels. What caused this?", opts: ["He used the wrong chart type","He included empty cells and Excel misinterpreted the headers as data values","The data was not sorted correctly","He forgot to add a chart title"], correct: [1], multi: false, cat: "Creating Charts", fb: "Including empty cells in the selection causes Excel to misread the layout." },
  { q: "What happens when you click on a chart in Excel? (Select all that apply)", opts: ["Chart Tools appear — Design and Format tabs","The data range is highlighted in the spreadsheet","Sizing handles appear around the chart","Sort & Filter tools are disabled while the chart is selected"], correct: [0,1,2,3], multi: true, cat: "Chart Tools & Moving", fb: "All four things happen: Chart Tools appear, source data is highlighted, sizing handles show, and Sort/Filter is disabled." },
  { q: "Which methods can be used to move a chart to a different worksheet? (Select all that apply)", opts: ["Chart Tools → Design tab → Move Chart","Right-click the chart → Move Chart","Cut the chart (Ctrl+X) and paste it on another sheet","Drag the chart to the sheet tab at the bottom"], correct: [0,1,2], multi: true, cat: "Chart Tools & Moving", fb: "Move Chart (via Design tab or right-click) and Cut/Paste all work. Dragging to a sheet tab is not supported." },
  { q: "Which of the following chart elements can be modified? (Select all that apply)", opts: ["Chart area (the full canvas background)","Chart title","Plot area (the graphing space inside the axes)","Legend"], correct: [0,1,2,3], multi: true, cat: "Chart Tools & Moving", fb: "All four elements are fully customisable via the Format tab or right-click menu." },
  { q: "Sean moves a chart using the Move Chart tool but then wants to undo it. Why doesn't Ctrl+Z work?", opts: ["Ctrl+Z is disabled when a chart is selected","Undo does not work with the Move Chart tool — the action must be reversed manually","The chart was saved automatically after moving","Excel requires you to close and reopen the file to undo chart moves"], correct: [1], multi: false, cat: "Chart Tools & Moving", fb: "The Move Chart tool is one of the few Excel actions that cannot be undone with Ctrl+Z." },
  { q: "How do you create a chart that displays full-screen on its own dedicated sheet?", opts: ["Resize the chart until it fills the screen","Right-click the sheet tab → Insert Chart Sheet","Use Move Chart tool → select 'New sheet' option","Insert tab → Charts → Full Screen Chart"], correct: [2], multi: false, cat: "Chart Tools & Moving", fb: "Move Chart → New sheet creates a dedicated chart sheet where the chart fills the entire tab." },
  { q: "How can you change the chart type after a chart has already been created? (Select all that apply)", opts: ["Insert tab → Charts group → choose a new type","Right-click the chart → Change Chart Type","Design tab → Change Chart Type","Delete the chart and start again — type cannot be changed after creation"], correct: [0,1,2], multi: true, cat: "Chart Types & Layouts", fb: "You can change chart type via Insert tab, right-clicking the chart, or the Design tab." },
  { q: "Sean applied a Quick Layout to his chart and it matched a screenshot. Which Quick Layout number was used?", opts: ["Quick Layout 1","Quick Layout 3","Quick Layout 5","Quick Layout 7"], correct: [2], multi: false, cat: "Chart Types & Layouts", fb: "Quick Layout 5 produces the specific arrangement of elements that matches the screenshot shown." },
  { q: "What is the difference between Quick Layout and Chart Styles? (Select all that apply)", opts: ["Quick Layout changes chart elements and their positions on the chart","Chart Styles change the appearance — fonts, colours, and shading","Quick Layout and Chart Styles do the same thing","Chart Styles affect the data values displayed"], correct: [0,1], multi: true, cat: "Chart Types & Layouts", fb: "Quick Layout controls STRUCTURE. Chart Styles control DESIGN (colours, fonts, visual effects)." },
  { q: "If you copy a chart and paste it into another location, will it still update when the original data changes?", opts: ["True — pasted charts remain linked to the original data","False — pasted charts become static images","Only if you use Paste Special → Linked","Only if both locations are on the same sheet"], correct: [0], multi: false, cat: "Editing Charts", fb: "True — a pasted chart is still linked to the original data source and will automatically reflect any changes." },
  { q: "How do you add a missing horizontal axis title to an existing chart?", opts: ["Click the chart title and rename it","Right-click the X axis → Add Title","Use Add Chart Element in the Design tab","Double-click the chart to enter edit mode, then type"], correct: [2], multi: false, cat: "Editing Charts", fb: "Design tab → Add Chart Element → Axis Titles → Primary Horizontal lets you add or edit the horizontal axis label." },
  { q: "Can Sean change the data range of a chart after it has been created? (Select all that apply)", opts: ["Yes — via Select Data in the Design tab","Yes — by dragging the sizing handles on the highlighted data range in the spreadsheet","No — the data range is fixed when the chart is created","Yes — by deleting the chart and inserting a new one with the correct range"], correct: [0,1], multi: true, cat: "Editing Charts", fb: "Both methods work: Select Data in the Design tab or directly dragging the coloured data-range handles." },
  { q: "What is the Chart Area in Excel?", opts: ["Only the bars, lines, or slices showing the data","The area bounded by the X and Y axes","The entire chart canvas, including all elements such as title, legend, and plot area","The background colour of the chart"], correct: [2], multi: false, cat: "Chart Elements", fb: "The Chart Area is the entire chart object — everything from edge to edge including all elements." },
  { q: "What is the Plot Area?", opts: ["The full chart including titles and legend","The area framed by the X and Y axes where the actual data visualisation is drawn","The colour applied to the chart background","The table of data that feeds the chart"], correct: [1], multi: false, cat: "Chart Elements", fb: "The Plot Area is the space inside the axes where bars, lines, or pie slices are drawn." },
  { q: "What is the purpose of the Legend on a chart?", opts: ["It provides the chart title","It explains what each colour or symbol in the chart represents","It shows the data values on each bar or point","It displays the axis scale numbers"], correct: [1], multi: false, cat: "Chart Elements", fb: "The Legend identifies each data series by colour or pattern." },
  { q: "What are the best practices when selecting data for a chart? (Select all that apply)", opts: ["Include column and row headings in the selection","Avoid selecting empty rows or columns","Carefully select only the relevant data — don't include unrelated columns","Always select the entire worksheet"], correct: [0,1,2], multi: true, cat: "Chart Elements", fb: "Include headers, avoid empty cells, and only select relevant data columns." },
  { q: "What is the full title of Table 1 in the workbook used in the practical exercise?", opts: ["Crime Statistics in Australia 1994-2013","Crime in the United States by Volume, 1994-2013","US Federal Crime Report 1994-2013","Annual Crime Data by Category, USA"], correct: [1], multi: false, cat: "Chart Elements", fb: "The table is titled 'Crime in the United States by Volume, 1994-2013'." },
  { q: "Which cell range was selected to create the first chart in the practical exercise?", opts: ["A1:B5","A3:B9","A5:B9","A5:C9"], correct: [2], multi: false, cat: "Practical Task", fb: "The range A5:B9 was selected — including the relevant category labels and one data series." },
  { q: "What type of chart is shown in the first chart created during the practical task?", opts: ["Bar chart","Pie chart","Line chart","Column chart"], correct: [2], multi: false, cat: "Practical Task", fb: "A Line chart is used to show the trend in crime data over time." },
  { q: "The first chart created is missing several important elements. Which are absent? (Select all that apply)", opts: ["A meaningful descriptive title","A legend identifying each data series","X-axis label information","Data labels on each point"], correct: [0,1,2], multi: true, cat: "Practical Task", fb: "The initial chart is missing a proper title, a legend, and X-axis label information." },
  { q: "For the 2-D Pie Chart showing crime data for 2004, which year's data column was selected?", opts: ["2000","2002","2004","2006"], correct: [2], multi: false, cat: "Practical Task", fb: "The 2004 column was selected to create the 2-D Pie Chart." },
  { q: "What title was given to the final Line Chart in the practical exercise?", opts: ["US Crime Statistics","Crime Data 1994-2013","Crime in the USA 1994-2013","Crime by Volume USA"], correct: [2], multi: false, cat: "Practical Task", fb: "The final line chart was titled 'Crime in the USA 1994-2013'." },
  { q: "What label was applied to the vertical (Y) axis of the final Line Chart?", opts: ["Crime Categories","Year","Number of crimes","Total incidents"], correct: [2], multi: false, cat: "Practical Task", fb: "The vertical axis was labelled 'Number of crimes'." },
  { q: "In the final Line Chart, what colour was used for the Violent Crime data series?", opts: ["Red","Blue","Green","Yellow"], correct: [2], multi: false, cat: "Practical Task", fb: "Violent Crime was displayed in green as specified in the chart formatting instructions." },
  { q: "In the final Line Chart, what colour was used for the Burglary data series?", opts: ["Red","Blue","Green","Yellow"], correct: [1], multi: false, cat: "Practical Task", fb: "Burglary was displayed in blue in the final formatted line chart." },
  { q: "In the final Line Chart, what colour was used for the Motor Vehicle Theft data series?", opts: ["Red","Blue","Green","Yellow"], correct: [3], multi: false, cat: "Practical Task", fb: "Motor Vehicle Theft was displayed in yellow." },
  { q: "Which Quick Layout was applied to the final Line Chart to add axis titles and reposition the legend?", opts: ["Quick Layout 1","Quick Layout 3","Quick Layout 5","Quick Layout 9"], correct: [2], multi: false, cat: "Practical Task", fb: "Quick Layout 5 was applied — this layout adds axis titles and positions the legend correctly." }
];

const QUIZZES = [
  { id: "Week1", title: "Excel Fundamentals", icon: "📊", data: norm(RAW_Week1) },
  { id: "Week2", title: "Fill Handle & AutoFill", icon: "🔢", data: norm(RAW_Week2) },
  { id: "Week3", title: "Formatting", icon: "🎨", data: norm(RAW_Week3) },
  { id: "Formulas", title: "Formulas & Functions", icon: "➕", data: norm(RAW_Formulas) },
  { id: "Week4", title: "Data Management", icon: "🗂", data: norm(RAW_Week4) },
  { id: "Week5", title: "Printing & Page Setup", icon: "🖨", data: norm(RAW_Week5) },
  { id: "Week6", title: "Charts & Graphs", icon: "📈", data: norm(RAW_Week6) },
];

const LTRS = ["A","B","C","D","E","F"];
const TEACHER_PIN = "1234";

// ── STORAGE ──
function saveResult(r) {
  try { localStorage.setItem("qr_"+r.ts+"_"+Math.random().toString(36).slice(2,6), JSON.stringify(r)); } catch(e) {}
}
function loadResults() {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("qr_")) { try { out.push(JSON.parse(localStorage.getItem(k))); } catch(e) {} }
    }
  } catch(e) {}
  return out.sort((a,b)=>b.ts-a.ts);
}
function clearResults() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith("qr_")) keys.push(k); }
    keys.forEach(k => localStorage.removeItem(k));
  } catch(e) {}
}

const S = { HOME: "home", QUIZ: "quiz", RESULTS: "results", TEACHER_LOGIN: "tlogin", TEACHER: "teacher" };

export default function App() {
  const [screen, setScreen] = useState(S.HOME);
  const [name, setName] = useState("");
  const [num, setNum] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [result, setResult] = useState(null);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  const isCorrect = (q, sel) => [...q.correct].sort().join(",") === [...sel].sort().join(",");

  const startQuiz = (quiz) => {
    if (!name.trim()) { setNameErr(true); return; }
    setNameErr(false);
    setActiveQuiz(quiz);
    setQs(quiz.data);
    setIdx(0);
    setScore(0);
    setAnswers(quiz.data.map(() => ({ sel: [], done: false })));
    setTimeLeft(20 * 60);
    setScreen(S.QUIZ);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (screen === S.QUIZ && timeLeft === 0) doSubmit();
  }, [timeLeft, screen]);

  const pickOpt = (i) => {
    const a = answers[idx];
    if (a.done) return;
    const q = qs[idx];
    if (q.multi) {
      const sel = a.sel.includes(i) ? a.sel.filter(x=>x!==i) : [...a.sel, i];
      setAnswers(prev => { const n=[...prev]; n[idx]={...n[idx], sel}; return n; });
    } else {
      const sel = [i];
      const correct = isCorrect(q, sel);
      setAnswers(prev => { const n=[...prev]; n[idx]={sel, done:true}; return n; });
      if (correct) setScore(s => s+1);
    }
  };

  const submitMulti = () => {
    const a = answers[idx];
    if (a.done || a.sel.length === 0) return;
    const correct = isCorrect(qs[idx], a.sel);
    setAnswers(prev => { const n=[...prev]; n[idx]={...n[idx], done:true}; return n; });
    if (correct) setScore(s => s+1);
  };

  const navQ = (dir) => {
    if (qs[idx].multi && !answers[idx].done && answers[idx].sel.length > 0) submitMulti();
    setIdx(i => Math.max(0, Math.min(qs.length-1, i+dir)));
  };

  const doSubmit = () => {
    clearInterval(timerRef.current);
    let finalScore = score;
    const finalAnswers = answers.map((a, i) => {
      if (!a.done && a.sel.length > 0) {
        const correct = isCorrect(qs[i], a.sel);
        if (correct) finalScore++;
        return { ...a, done: true };
      }
      return a;
    });
    const elapsed = 20*60 - timeLeft;
    const pct = Math.round(finalScore / qs.length * 100);
    const r = { ts: Date.now(), name: name.trim(), num: num.trim(), qid: activeQuiz.id, qtitle: activeQuiz.title, score: finalScore, total: qs.length, pct, time: elapsed };
    saveResult(r);
    setResult(r);
    setScreen(S.RESULTS);
  };

  const openTeacher = () => {
    if (pin === TEACHER_PIN) { setResults(loadResults()); setScreen(S.TEACHER); setPinErr(false); }
    else setPinErr(true);
  };

  const fmt = (secs) => `${Math.floor(secs/60)}:${String(secs%60).padStart(2,"0")}`;
  const timerWarn = timeLeft <= 300 && timeLeft > 60;
  const timerDanger = timeLeft <= 60;

  // ── RENDER ──
  const q = qs[idx];
  const a = answers[idx];

  const styles = {
    root: { background: "#0d1117", color: "#e6edf3", minHeight: "100vh", fontFamily: "system-ui,-apple-system,sans-serif" },
    bar: { position: "fixed", top: 0, left: 0, right: 0, height: 58, background: "rgba(13,17,23,.97)", borderBottom: "1px solid #30363d", display: "flex", alignItems: "center", padding: "0 20px", zIndex: 999, gap: 12 },
    barTitle: { fontSize: 13, fontWeight: 700, color: "#3fb950", letterSpacing: ".05em", whiteSpace: "nowrap" },
    page: { maxWidth: 720, margin: "0 auto", padding: "76px 16px 60px" },
    badge: { display: "inline-block", background: "rgba(63,185,80,.13)", border: "1px solid rgba(63,185,80,.3)", color: "#3fb950", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 99, marginBottom: 14 },
    heroH: { fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 700, marginBottom: 8 },
    heroP: { color: "#7d8590", fontSize: 14, lineHeight: 1.7, marginBottom: 0 },
    ncard: { background: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: "24px 28px", maxWidth: 460, margin: "22px auto 26px" },
    field: { marginBottom: 12 },
    label: { display: "block", fontSize: 10, color: "#7d8590", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 },
    inp: { width: "100%", background: "#21262d", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 14, padding: "10px 13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
    secLbl: { fontSize: 11, color: "#7d8590", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 10, marginBottom: 28 },
    qbtn: { background: "#161b22", border: "1.5px solid #30363d", borderRadius: 12, padding: "18px 16px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all .2s", color: "#e6edf3" },
    qcard: { background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "24px", marginBottom: 14 },
    qmeta: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" },
    qnum: { fontSize: 11, color: "#388bfd", textTransform: "uppercase", letterSpacing: ".1em" },
    qcat: { fontSize: 10, color: "#7d8590", background: "#21262d", border: "1px solid #30363d", padding: "2px 7px", borderRadius: 99 },
    mtag: { fontSize: 10, color: "#d29922", background: "rgba(210,153,34,.1)", border: "1px solid rgba(210,153,34,.3)", padding: "2px 7px", borderRadius: 99 },
    qtext: { fontSize: 15.5, fontWeight: 500, lineHeight: 1.55, marginBottom: 18 },
    opts: { display: "flex", flexDirection: "column", gap: 7 },
    navrow: { display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", marginTop: 4 },
    navbtn: { fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 8, border: "1px solid #30363d", background: "#21262d", color: "#7d8590", cursor: "pointer", fontFamily: "inherit" },
    subbtn: { width: "100%", marginTop: 10, background: "linear-gradient(135deg,#238636,#2ea043)", color: "#fff", fontSize: 15, fontWeight: 700, padding: 14, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit" },
    rescard: { background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: "44px 32px 36px", textAlign: "center", marginBottom: 16 },
    statrow: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 22 },
    stat: { display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 20px", background: "#21262d", border: "1px solid #30363d", borderRadius: 10, minWidth: 85 },
    btnG: { background: "#3fb950", color: "#0d1117", fontSize: 14, fontWeight: 700, padding: "12px 26px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", margin: 3 },
    btnO: { background: "#21262d", color: "#e6edf3", fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 9, border: "1px solid #30363d", cursor: "pointer", fontFamily: "inherit", margin: 3 },
    tbl: { width: "100%", borderCollapse: "collapse", background: "#161b22", borderRadius: 12, overflow: "hidden", border: "1px solid #30363d", fontSize: 13 },
    back: { background: "none", border: "none", color: "#7d8590", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 18, fontFamily: "inherit" },
    pw: { flex: 1, height: 5, background: "#30363d", borderRadius: 99, overflow: "hidden", maxWidth: 300 },
  };

  const optStyle = (i, q2, a2) => {
    const isSel = a2.sel.includes(i);
    const isCor = q2.correct.includes(i);
    let bg = "#21262d", border = "1.5px solid #30363d";
    if (a2.done) {
      if (isCor) { bg = "rgba(63,185,80,.12)"; border = "1.5px solid #3fb950"; }
      else if (isSel) { bg = "rgba(248,81,73,.1)"; border = "1.5px solid #f85149"; }
    } else if (isSel) { bg = "rgba(56,139,253,.11)"; border = "1.5px solid #388bfd"; }
    return { display: "flex", alignItems: "center", gap: 11, background: bg, border, borderRadius: 9, padding: "11px 14px", cursor: a2.done ? "default" : "pointer", userSelect: "none", marginBottom: 0 };
  };

  const dotStyle = (i, q2, a2) => {
    const isSel = a2.sel.includes(i);
    const isCor = q2.correct.includes(i);
    let bg = "transparent", border = "2px solid #30363d", color = "#7d8590";
    if (a2.done) {
      if (isCor) { bg = "#3fb950"; border = "2px solid #3fb950"; color = "#0d1117"; }
      else if (isSel) { bg = "#f85149"; border = "2px solid #f85149"; color = "#fff"; }
    } else if (isSel) { bg = "#388bfd"; border = "2px solid #388bfd"; color = "#fff"; }
    return { width: 21, height: 21, borderRadius: q2.multi ? 4 : "50%", border, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 };
  };

  const scoreBoxStyle = { display: "flex", alignItems: "center", gap: 6, background: "rgba(63,185,80,.13)", border: "1px solid rgba(63,185,80,.3)", borderRadius: 8, padding: "4px 12px" };
  const timerBoxStyle = { display: "flex", alignItems: "center", gap: 6, background: timerDanger ? "rgba(248,81,73,.1)" : timerWarn ? "rgba(210,153,34,.1)" : "#21262d", border: `1px solid ${timerDanger ? "rgba(248,81,73,.4)" : timerWarn ? "rgba(210,153,34,.4)" : "#30363d"}`, borderRadius: 8, padding: "4px 12px" };
  const timerNumColor = timerDanger ? "#f85149" : timerWarn ? "#d29922" : "#e6edf3";

  // HOME
  if (screen === S.HOME) return (
    <div style={styles.root}>
      <div style={styles.bar}><div style={styles.barTitle}>📊 EXCEL QUIZ HUB</div></div>
      <div style={styles.page}>
        <div style={{ textAlign: "center", padding: "36px 0 24px" }}>
          <div style={styles.badge}>Excel Course</div>
          <div style={styles.heroH}>Quiz <span style={{ color: "#3fb950" }}>Hub</span></div>
          <div style={styles.heroP}>Enter your name, choose a quiz, and start writing your test.<br/>All 7 topics available below.</div>
        </div>
        <div style={styles.ncard}>
          <div style={styles.field}>
            <label style={styles.label}>Your Full Name *</label>
            <input style={{ ...styles.inp, borderColor: nameErr ? "#f85149" : "#30363d" }} value={name} onChange={e => { setName(e.target.value); setNameErr(false); }} placeholder="e.g. Jane Smith" />
            {nameErr && <div style={{ color: "#f85149", fontSize: 12, marginTop: 4 }}>⚠ Please enter your name before starting a quiz.</div>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Student Number (optional)</label>
            <input style={styles.inp} value={num} onChange={e => setNum(e.target.value)} placeholder="e.g. STU2024001" />
          </div>
        </div>
        <div style={styles.secLbl}>Choose a Quiz to Write</div>
        <div style={styles.grid}>
          {QUIZZES.map(q => (
            <button key={q.id} style={styles.qbtn} onClick={() => startQuiz(q)}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#3fb950"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(63,185,80,.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#30363d"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
              <div style={{ fontSize: 24, marginBottom: 7 }}>{q.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{q.title}</div>
              <div style={{ fontSize: 11, color: "#7d8590" }}>{q.data.length} questions · 20 min</div>
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button style={styles.btnO} onClick={() => setScreen(S.TEACHER_LOGIN)}>👩‍🏫 Teacher Dashboard</button>
        </div>
      </div>
    </div>
  );

  // QUIZ
  if (screen === S.QUIZ && q) return (
    <div style={styles.root}>
      <div style={styles.bar}>
        <div style={styles.barTitle}>{activeQuiz.icon} {activeQuiz.title.toUpperCase()}</div>
        <div style={{ ...styles.pw, marginLeft: "auto" }}>
          <div style={{ height: "100%", width: `${((idx+1)/qs.length)*100}%`, background: "linear-gradient(90deg,#3fb950,#79c0ff)", borderRadius: 99, transition: "width .3s" }} />
        </div>
        <div style={{ fontSize: 11, color: "#7d8590", minWidth: 44 }}>{idx+1}/{qs.length}</div>
        <div style={scoreBoxStyle}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#3fb950" }}>{score}</div>
          <div style={{ fontSize: 10, color: "#7d8590" }}>pts</div>
        </div>
        <div style={timerBoxStyle}>
          <span>⏱</span>
          <div style={{ fontSize: 15, fontWeight: 700, color: timerNumColor, minWidth: 40 }}>{fmt(timeLeft)}</div>
        </div>
      </div>
      <div style={styles.page}>
        <button style={styles.back} onClick={() => { clearInterval(timerRef.current); setScreen(S.HOME); }}>← Back to Quiz Hub</button>
        <div style={styles.qcard}>
          <div style={styles.qmeta}>
            <span style={styles.qnum}>Q{idx+1}</span>
            {q.cat && <span style={styles.qcat}>{q.cat}</span>}
            {q.multi && <span style={styles.mtag}>Select all that apply</span>}
          </div>
          <div style={styles.qtext}>{q.q}</div>
          <div style={styles.opts}>
            {q.options.map((opt, i) => (
              <div key={i} style={optStyle(i, q, a)} onClick={() => pickOpt(i)}>
                <div style={dotStyle(i, q, a)}>{LTRS[i]}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.45, flex: 1 }} dangerouslySetInnerHTML={{ __html: opt }} />
              </div>
            ))}
          </div>
          {a.done && q.fb && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 12, padding: "11px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.5, ...(isCorrect(q, a.sel) ? { background: "rgba(63,185,80,.12)", border: "1px solid rgba(63,185,80,.25)", color: "#7ee787" } : { background: "rgba(248,81,73,.1)", border: "1px solid rgba(248,81,73,.2)", color: "#ffa198" }) }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{isCorrect(q, a.sel) ? "✅" : "❌"}</span>
              <span>{q.fb}</span>
            </div>
          )}
          {q.multi && !a.done && a.sel.length > 0 && (
            <button style={{ ...styles.subbtn, marginTop: 12 }} onClick={submitMulti}>Confirm Answer</button>
          )}
        </div>
        <div style={styles.navrow}>
          <button style={{ ...styles.navbtn, opacity: idx === 0 ? .3 : 1 }} disabled={idx === 0} onClick={() => navQ(-1)}>← Prev</button>
          <span style={{ fontSize: 11, color: "#7d8590" }}>Question {idx+1} of {qs.length}</span>
          <button style={{ ...styles.navbtn, opacity: idx === qs.length-1 ? .3 : 1 }} disabled={idx === qs.length-1} onClick={() => navQ(1)}>Next →</button>
        </div>
        {idx === qs.length-1 && <button style={styles.subbtn} onClick={doSubmit}>Submit Quiz ✓</button>}
      </div>
    </div>
  );

  // RESULTS
  if (screen === S.RESULTS && result) return (
    <div style={styles.root}>
      <div style={styles.bar}><div style={styles.barTitle}>📊 EXCEL QUIZ HUB</div></div>
      <div style={styles.page}>
        <button style={styles.back} onClick={() => setScreen(S.HOME)}>← Back to Quiz Hub</button>
        <div style={styles.rescard}>
          <div style={{ fontSize: "clamp(2.5rem,7vw,4rem)", fontWeight: 700, marginBottom: 6 }}>
            {result.pct >= 80 ? "🏆" : result.pct >= 60 ? "👍" : "📚"} {result.pct}%
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{activeQuiz.icon} {activeQuiz.title}</div>
          <div style={{ color: "#7d8590", fontSize: 13, marginBottom: 20 }}>Well done, {result.name}! Your result has been saved.</div>
          <div style={styles.statrow}>
            {[["Correct", result.score, "#3fb950"], ["Wrong", result.total-result.score, "#f85149"], ["Total", result.total, "#e6edf3"], ["Time", `${Math.floor(result.time/60)}m ${result.time%60}s`, "#388bfd"]].map(([l,n,c]) => (
              <div key={l} style={styles.stat}><div style={{ fontSize: 18, fontWeight: 700, color: c }}>{n}</div><div style={{ fontSize: 10, color: "#7d8590", marginTop: 2 }}>{l}</div></div>
            ))}
          </div>
          <button style={styles.btnG} onClick={() => setScreen(S.HOME)}>Back to Quiz Hub</button>
        </div>
      </div>
    </div>
  );

  // TEACHER LOGIN
  if (screen === S.TEACHER_LOGIN) return (
    <div style={styles.root}>
      <div style={styles.bar}><div style={styles.barTitle}>📊 EXCEL QUIZ HUB</div></div>
      <div style={styles.page}>
        <button style={styles.back} onClick={() => setScreen(S.HOME)}>← Back to Hub</button>
        <div style={{ maxWidth: 320, margin: "30px auto", background: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: "26px 26px" }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, textAlign: "center" }}>👩‍🏫 Teacher Access</div>
          <div style={styles.field}>
            <label style={styles.label}>PIN</label>
            <input style={styles.inp} type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter teacher PIN" onKeyDown={e => e.key === "Enter" && openTeacher()} />
          </div>
          {pinErr && <div style={{ color: "#f85149", fontSize: 12, marginBottom: 8 }}>Incorrect PIN. Try again.</div>}
          <button style={{ ...styles.btnG, width: "100%", marginTop: 8 }} onClick={openTeacher}>Open Dashboard</button>
          <p style={{ color: "#7d8590", fontSize: 11, textAlign: "center", marginTop: 10 }}>Default PIN: 1234</p>
        </div>
      </div>
    </div>
  );

  // TEACHER DASHBOARD
  if (screen === S.TEACHER) {
    const byQ = {};
    results.forEach(r => { if (!byQ[r.qid]) byQ[r.qid] = []; byQ[r.qid].push(r); });
    return (
      <div style={styles.root}>
        <div style={styles.bar}><div style={styles.barTitle}>👩‍🏫 TEACHER DASHBOARD</div></div>
        <div style={styles.page}>
          <button style={styles.back} onClick={() => setScreen(S.HOME)}>← Back to Hub</button>
          <div style={{ textAlign: "center", padding: "10px 0 22px" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>Teacher Dashboard</div>
            <div style={{ color: "#7d8590", fontSize: 13 }}>All completed quiz results from this browser</div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 12, flexWrap: "wrap" }}>
            <button style={styles.btnO} onClick={() => setResults(loadResults())}>🔄 Refresh</button>
            <button style={styles.btnO} onClick={() => {
              const rows = [["Name","Student No","Quiz","Score","Total","%","Time(secs)","Date"]];
              results.forEach(r => rows.push([r.name,r.num||"",r.qtitle,r.score,r.total,r.pct+"%",r.time,new Date(r.ts).toLocaleString()]));
              const csv = rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n");
              const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(csv); a.download = "quiz_results.csv"; a.click();
            }}>⬇ Export CSV</button>
            <button style={{ ...styles.btnO, borderColor: "rgba(248,81,73,.3)", color: "#f85149" }} onClick={() => { if (confirm("Delete all results?")) { clearResults(); setResults([]); } }}>🗑 Clear All</button>
          </div>
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "44px 20px", color: "#7d8590" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
              <div>No results yet. Students will appear here after completing a quiz on this device.</div>
            </div>
          ) : (
            <>
              <div style={styles.secLbl}>Summary by Quiz</div>
              <div style={{ ...styles.grid, marginBottom: 24 }}>
                {Object.entries(byQ).map(([qid, arr]) => {
                  const qi = QUIZZES.find(x => x.id === qid) || { icon: "📊", title: qid };
                  const avg = Math.round(arr.reduce((s,r)=>s+r.pct,0)/arr.length);
                  return (
                    <div key={qid} style={{ ...styles.qbtn, cursor: "default" }}>
                      <div style={{ fontSize: 24, marginBottom: 7 }}>{qi.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{qi.title}</div>
                      <div style={{ fontSize: 11, color: "#7d8590", marginBottom: 6 }}>{arr.length} student{arr.length!==1?"s":""}</div>
                      <div style={{ display: "inline-block", fontSize: 10, color: "#3fb950", background: "rgba(63,185,80,.13)", border: "1px solid rgba(63,185,80,.3)", padding: "2px 8px", borderRadius: 99 }}>Avg: {avg}%</div>
                    </div>
                  );
                })}
              </div>
              <div style={styles.secLbl}>All Results ({results.length})</div>
              <div style={{ overflowX: "auto" }}>
                <table style={styles.tbl}>
                  <thead>
                    <tr>{["Student","Quiz","Score","Time","Date"].map(h => (
                      <th key={h} style={{ fontSize: 10, textTransform: "uppercase", color: "#7d8590", padding: "10px 13px", textAlign: "left", borderBottom: "1px solid #30363d", background: "#21262d" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => {
                      const cls = r.pct>=80?"#3fb950":r.pct>=60?"#d29922":"#f85149";
                      const d = new Date(r.ts);
                      return (
                        <tr key={i}>
                          <td style={{ padding: "10px 13px", borderBottom: "1px solid #30363d" }}><strong>{r.name}</strong>{r.num && <><br/><small style={{ color: "#7d8590" }}>{r.num}</small></>}</td>
                          <td style={{ padding: "10px 13px", borderBottom: "1px solid #30363d" }}>{r.qtitle}</td>
                          <td style={{ padding: "10px 13px", borderBottom: "1px solid #30363d" }}><span style={{ background: cls==="#3fb950"?"rgba(63,185,80,.13)":cls==="#d29922"?"rgba(210,153,34,.1)":"rgba(248,81,73,.1)", color: cls, border: `1px solid ${cls}40`, padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{r.score}/{r.total} ({r.pct}%)</span></td>
                          <td style={{ padding: "10px 13px", borderBottom: "1px solid #30363d", color: "#7d8590", fontSize: 11 }}>{Math.floor(r.time/60)}m {r.time%60}s</td>
                          <td style={{ padding: "10px 13px", borderBottom: "1px solid #30363d", color: "#7d8590", fontSize: 11 }}>{d.toLocaleDateString()} {d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return <div style={styles.root}><div style={{ padding: "100px 20px", textAlign: "center", color: "#7d8590" }}>Loading...</div></div>;
}
