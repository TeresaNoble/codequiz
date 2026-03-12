import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const CATEGORIES = {
  fundamentals: "Code Fundamentals",
  types: "Data Types",
  syntax: "Syntax & Operators",
  powerapps: "PowerApps",
};

const CARDS = [
  { front: "What is a variable?", back: "A named container that stores a value for later use. e.g. x = 5", hint: "Think of a variable like a labelled box. You write a name on the outside and put something inside — a number, some text, anything. Later you can open the box by using its name. In Python: name = 'Teresa' stores the text Teresa under the label 'name'.", explanation: "A variable is a label pointing to a stored value — not the value itself. x = 5 means 'create a box called x and put 5 in it'. You can change what's inside later, which is why it's called a variable.", distractors: ["A fixed value that cannot be changed once set. e.g. x = 5 is permanent", "A named function that returns a value when called. e.g. x() = 5", "A data type that only holds whole numbers. e.g. x = 5 means x is an integer"], category: "fundamentals" },
  { front: "What is a string?", back: 'Text data. e.g. "hello" or \'world\'', hint: "A string is any sequence of characters wrapped in quotes — letters, numbers, spaces, symbols. The quotes tell the computer 'treat this as text, not code'. In PowerApps you might store a user's name as a string: \"Teresa\".", explanation: "Strings are always wrapped in quotes so the computer knows it's text, not code. \"42\" is a string — you can't do maths with it. 42 without quotes is a number. In PowerApps, most label and text input values are strings.", distractors: ["Numeric data stored as a sequence of digits. e.g. \"42\" is a string integer", "A list of characters that can only contain letters, not numbers or symbols", "Text data but only when wrapped in double quotes — single quotes create a character type"], category: "types" },
  { front: "What is an integer?", back: "A whole number. e.g. 42", hint: "Integers are counting numbers — no decimal point allowed. They can be positive, negative, or zero. You'd use an integer for things like a score, a quantity, or a row count. 42 is an integer; 42.0 is not.", explanation: "If it has a decimal point it's a float, not an integer. Integers are for whole counts — rows, scores, quantities. Most languages treat 42 and 42.0 as different types, even though they look similar.", distractors: ["Any number including decimals. e.g. 42 and 42.5 are both integers", "A whole number but only positive — negative numbers use a different type", "A number stored as text so it can be displayed without formatting issues"], category: "types" },
  { front: "What is a float?", back: "A decimal number. e.g. 3.14", hint: "Float is short for 'floating point' — the decimal point can move around. Use floats for things like prices, percentages, or measurements. In PowerApps, most numeric fields handle decimals automatically, but in Python you'd see 3.14 stored as a float.", explanation: "Float stands for floating-point number — the decimal point can appear anywhere. Use floats for prices, measurements, or percentages. In Python, dividing two integers often gives you a float: 7 / 2 = 3.5.", distractors: ["A whole number that can optionally display decimal places for formatting", "A number type used only for very large values that exceed integer limits", "A decimal number but only between -1 and 1, used for percentages"], category: "types" },
  { front: "What is a boolean?", back: "True or False — nothing else", hint: "Booleans are binary — on or off, yes or no. They power all decision-making in code. In PowerApps, a toggle control returns a boolean. In Python, comparisons like 5 > 3 return True. Everything that controls flow — if statements, filters — relies on booleans.", explanation: "Booleans are the foundation of all logic in code — every if statement, every filter, every condition ultimately resolves to True or False. In PowerApps, toggle controls, checkboxes, and comparison formulas all return booleans.", distractors: ["A value that can be True, False, or Null when a value is missing", "A number type where 1 means True and 0 means False — not an actual True/False value", "A conditional expression that evaluates to a string: either \"true\" or \"false\""], category: "types" },
  { front: "What is an array / list?", back: "An ordered collection of items. e.g. [1, 2, 3]", hint: "A list holds multiple values in a single variable, in order. Like a shopping list — item 1, item 2, item 3. In Python: colours = ['red','green','blue']. In PowerApps, collections work similarly. You can loop through every item, or grab one by its position.", explanation: "Lists keep things in order and let you work with many values under one name. You access items by their position (index), usually starting at 0. In PowerApps, collections are the equivalent — tables of rows you can loop, filter, and patch.", distractors: ["An unordered collection of unique items where duplicates are automatically removed", "A collection of key-value pairs where each item has a name and a value", "An ordered collection but only for items of the same data type — mixed types aren't allowed"], category: "types" },
  { front: "What is an object / record?", back: 'A bundle of named fields. e.g. {name: "Teresa", age: 40}', hint: "An object groups related information under one label, using named fields called keys. Think of it like a form — each field has a label and a value. In PowerApps, a SharePoint row is a record. In JavaScript: user.name gives you 'Teresa' from the object above.", explanation: "Objects/records group related data together using named fields (keys). Unlike a list where you use a position number, you access values by name: user.name or user['name']. In PowerApps, every row returned from a data source is a record.", distractors: ["An ordered list of values accessed by position rather than name. e.g. {0: \"Teresa\", 1: 40}", "A bundle of named fields but only valid when all fields contain the same data type", "A named container for a single value with metadata attached. e.g. {name: \"Teresa\"} stores one item"], category: "types" },
  { front: "What does = mean in most languages?", back: "Assignment — store this value in this variable. e.g. x = 5", hint: "The single equals sign doesn't check anything — it puts a value into a variable. Read it as 'becomes': x becomes 5. In PowerApps: Set(myVar, 10) does the same job. Confusing = with == is one of the most common beginner bugs.", explanation: "= is an action, not a question. It writes a value into a variable. Read x = 5 as 'x becomes 5'. In PowerApps this is done with Set(x, 5) instead — the single = is used for comparison inside formulas.", distractors: ["Comparison — checks whether two values are equal and returns True or False", "Declaration — creates a new variable but does not assign a value to it yet", "Assignment — but only valid on the left side when the variable has already been declared"], category: "syntax" },
  { front: "What does == mean in most languages?", back: "Comparison — is this equal to that? e.g. x == 5 returns True or False", hint: "Double equals is a question, not an action. 'Is x the same as 5?' It returns a boolean. You'd use it in an if statement: if x == 5: do something. In PowerApps, the = operator doubles as comparison inside formulas like Filter(List, Status = \"Active\").", explanation: "== asks a question and returns True or False — it doesn't change anything. It's easy to mix up with =, which stores a value. In PowerApps, a single = does the comparison job inside formulas: Filter(List, Status = \"Active\").", distractors: ["Strict equality — checks both value and data type, unlike = which only checks value", "Assignment — stores a value but also confirms the variable already exists", "Comparison — checks whether two values are equal but only works with numbers, not strings"], category: "syntax" },
  { front: "What does != mean?", back: "Not equal to. e.g. x != 5 returns True if x is not 5", hint: "The ! means 'not', so != flips the equality check. It returns True when things don't match. Useful for filtering out specific values: show me everything except status 'Closed'. In PowerApps you'd write <> instead: Filter(List, Status <> \"Closed\").", explanation: "!= means 'these two things are different'. It's the opposite of ==. In PowerApps the equivalent is <> — so Filter(Tasks, Status <> \"Closed\") gives you everything that isn't closed.", distractors: ["Greater than or equal to — returns True if x is more than or exactly 5", "Not equal to, but only valid for string comparisons — use !== for numbers", "Strict inequality — checks that both the value and type are different, unlike <> which only checks value"], category: "syntax" },
  { front: "What does ! or 'not' do?", back: "Flips a boolean. !true becomes false. not True becomes False in Python", hint: "The NOT operator reverses whatever boolean it's applied to. If something is True, not it becomes False — and vice versa. Useful for toggling states: !isVisible hides something that's showing. In PowerApps: Not(IsBlank(field)) checks that a field has a value.", explanation: "NOT is a toggle for booleans. !true → false, !false → true. It's great for toggling UI state: UpdateContext({MenuOpen: !MenuOpen}) flips a menu open/closed. In PowerApps use Not() — e.g. Not(IsBlank(Email)).", distractors: ["Checks whether a value is null or undefined and returns True if it is", "Flips a boolean but only when used inside an if statement — standalone use returns an error", "Converts any value to its opposite type — turns numbers to text and text to numbers"], category: "syntax" },
  { front: "What is a conditional?", back: "A decision. If something is true, do this — otherwise, do that", hint: "Conditionals let code make choices. 'If the form is complete, submit it — otherwise show an error.' In Python: if score > 50: print('pass'). In PowerApps: If(IsBlank(Email), 'Required', 'OK'). Without conditionals, code just runs straight through with no logic.", explanation: "Conditionals are how code makes decisions. Without them, every app would do the same thing every time. In PowerApps, If() is your go-to: If(IsBlank(Email), \"Required\", \"OK\") shows different text based on whether a field is filled.", distractors: ["A loop that repeats an action only while a condition remains true", "A function that takes two arguments and returns whichever one is larger", "A decision that only runs once at app startup to set initial variable values"], category: "fundamentals" },
  { front: "What is a loop?", back: "Repeat an action for each item in a list or until a condition is met", hint: "Loops automate repetition. Instead of writing the same code 100 times, you write it once and loop. In Python: for item in list. In PowerApps: ForAll(Collection, Patch(...)). A loop that never stops is called an infinite loop — a common bug to watch for.", explanation: "Loops are automation for repetition — write the logic once, run it many times. In PowerApps, ForAll() is your loop: ForAll(Orders, Patch(Archive, Defaults(Archive), {Title: ThisRecord.Title})) processes every row.", distractors: ["A function that calls itself recursively until a return value is found", "A conditional that keeps checking a value and fires an action when it changes", "Repeat an action a fixed number of times — you must always specify the exact count upfront"], category: "fundamentals" },
  { front: "What is a function?", back: "A reusable block of code you can call by name", hint: "A function is like a recipe — you write the steps once, name it, and reuse it whenever you need. You can pass in ingredients (arguments) and get a result back. In PowerApps, If(), Filter(), and Patch() are all built-in functions. You can also write your own.", explanation: "Functions prevent you from repeating yourself. Write the logic once, call it by name whenever you need it. In PowerApps every formula like If(), Filter(), Patch() is a function — you're already using them constantly.", distractors: ["A reusable block of code that always returns a number and cannot modify variables", "A named variable that stores multiple values and can be iterated with a loop", "A block of code that only runs automatically when the app starts — cannot be called manually"], category: "fundamentals" },
  { front: "What are curly braces {} used for?", back: "Define a block of code or an object/record depending on language. In Python, indentation is used instead; in JS/PowerFx {} defines objects", hint: "Curly braces group things together, but what they group depends on context. In JavaScript they wrap code blocks (functions, if statements) AND define objects. In PowerFx (PowerApps), {} creates a record. Python skips braces entirely and uses indentation to show structure instead.", explanation: "Context matters with {}. In JavaScript they wrap both code blocks and objects. In PowerFx, {Title: \"Hello\", Done: false} creates an inline record. Python avoids them entirely — indentation does the grouping instead.", distractors: ["Always used to define arrays/lists across all languages — square brackets are only for objects", "Used exclusively to define objects/records — they never wrap code blocks in any language", "Define a block of code in Python and most languages — PowerApps uses them only for grouping conditions"], category: "syntax" },
  { front: "What does a semicolon ; do?", back: "Marks the end of a statement in many languages. PowerApps uses it to separate chained actions", hint: "In languages like JavaScript and Java, a semicolon tells the compiler 'this statement is done, next one starts here.' Python doesn't need them — line breaks do the job. In PowerApps, semicolons chain multiple actions together: Set(x,1); Navigate(Screen2).", explanation: "In most languages, ; ends a statement like a full stop ends a sentence. Python uses line breaks instead. In PowerApps, semicolons chain actions on a button: Set(Loading, true); Patch(...); Set(Loading, false).", distractors: ["Marks the start of a comment in most languages — anything after ; on a line is ignored", "Separates key-value pairs inside an object definition in JavaScript and PowerApps", "Marks the end of a statement, but only required in Python — other languages make it optional"], category: "syntax" },
  { front: "What does a colon : do?", back: 'Separates a key from its value in an object/record. e.g. {Title: "hello"}', hint: "The colon pairs a name with its value — the label on the left, the content on the right. In PowerApps records: {Title: \"Hello\", Done: false}. In Python, colons also signal the start of an indented block after if, for, and def statements.", explanation: "The colon is a separator between a name and its value in a record or object. In PowerApps: {Status: \"Active\", Count: 5}. In Python, colons also introduce code blocks — if x > 0: starts an indented block.", distractors: ["Marks the end of a line in Python and PowerApps — equivalent to a semicolon in JavaScript", "Separates a key from its value but only in arrays — objects use = for assignment instead", "Used only in Python to start a code block — it has no meaning inside object or record definitions"], category: "syntax" },
  { front: "What does a comma , do?", back: "Separates items in a list, arguments in a function, or fields in an object", hint: "Commas are separators — they tell the code 'here's where one thing ends and the next begins.' In a list: [1, 2, 3]. In a function call: Filter(List, Status = \"Active\"). In a record: {Name: \"T\", Age: 40}. Missing a comma is a very common syntax error.", explanation: "Commas keep things separated and readable. Forget one and you'll get a syntax error. In PowerApps: Patch(List, Defaults(List), {Title: \"Hello\", Status: \"Active\"}) — each argument and each field is comma-separated.", distractors: ["Separates items in a list only — function arguments use semicolons and objects use colons", "Marks a decimal point in numbers across all languages — 3,14 is the same as 3.14", "Separates items in a list and function arguments, but fields in an object are separated by semicolons"], category: "syntax" },
  { front: "What is a null / blank value?", back: "The absence of a value. Not zero, not empty string — nothing", hint: "Null means the value doesn't exist yet — it was never set. It's different from zero (that's a number) or \"\" (that's an empty string). In PowerApps: IsBlank() checks for null/blank. Forgetting to handle nulls is a frequent source of app crashes and formula errors.", explanation: "Null/blank is the absence of a value — not zero, not empty string, but nothing at all. In PowerApps, unset fields return blank. Always guard against it: If(IsBlank(Email), \"Required\", SubmitForm(Form1)) prevents errors.", distractors: ["An empty string value represented as \"\" — equivalent to a blank text field with no characters", "A zero value used as a placeholder when a number field hasn't been filled in yet", "The absence of a value, but in PowerApps null and blank are completely different types"], category: "types" },
  { front: "What is type inference?", back: "When a language figures out the data type automatically without you declaring it. PowerApps and Python do this", hint: "Some languages make you declare 'this is a number' or 'this is text' explicitly. Others just look at what you assigned and work it out. x = 5 — Python sees a whole number and treats it as an integer automatically. PowerApps does the same with formula results.", explanation: "Type inference means the language does the classification work for you. x = 5 in Python — no need to write int x = 5. PowerApps infers types from formula outputs. Strongly typed languages like Java require you to declare the type explicitly.", distractors: ["When a language converts one data type to another automatically during calculations. e.g. adding a number to a string", "When the compiler checks that all declared types are used correctly before running the code", "When a language figures out data types automatically, but only for numbers — strings must always be declared"], category: "types" },
  { front: "What is a strongly typed language?", back: "A language where you must declare the type of a variable. e.g. int x = 5 in Java or C", hint: "Strong typing means you have to be explicit upfront — 'this box will only ever hold integers.' It catches mistakes early: if you try to put text in an integer variable, the compiler stops you. Java, C, and TypeScript are strongly typed. Python and PowerApps are more flexible.", explanation: "Strong typing forces you to be explicit: int x = 5 means this variable will only ever hold integers. It catches type mismatches at compile time, before the code runs. Python and PowerApps infer types instead, which is more flexible but can hide bugs.", distractors: ["A language that prevents all type conversions — you can never change a variable's value once set", "A language where variables are typed but types can be changed at any time during runtime", "A language where you declare types only for function parameters, not for regular variables"], category: "types" },
  { front: "What is ClearCollect in PowerApps?", back: "Wipes a collection then refills it with new data. Equivalent to clearing an array then populating it", hint: "If you use Collect() repeatedly, data stacks up and you get duplicates. ClearCollect() solves this by emptying the collection first, then filling it fresh. Think of it like clearing a whiteboard before writing new notes. Use it when refreshing data from a source.", explanation: "ClearCollect = Clear + Collect in one step. Without it, running Collect() twice doubles your data. Use ClearCollect when you want a fresh load — e.g. on screen load or after a filter change. It's the safe default for refreshing collections.", distractors: ["Removes a single matching record from a collection based on a condition you specify", "Creates a new empty collection — you must use Collect() separately to add data to it", "Wipes a collection and refills it, but only works with SharePoint lists — not local data"], category: "powerapps" },
  { front: "What is Patch in PowerApps?", back: "Writes or updates records in a data source. Equivalent to a save or update function", hint: "Patch is PowerApps' way of saving data. You tell it where to save (the data source), which record to target (or use Defaults() for a new one), and what fields to write. Patch(SharePointList, Defaults(SharePointList), {Title: TextInput.Text}) creates a new row.", explanation: "Patch is your save button in code form. For a new record: Patch(List, Defaults(List), {Title: \"New item\"}). To update an existing one: Patch(List, ThisItem, {Status: \"Done\"}). You only need to include the fields you're changing.", distractors: ["Reads a single record from a data source by ID and loads it into a form for editing", "Writes records to a collection only — to update a SharePoint list you need SubmitForm()", "Updates records in a data source but requires the full record — partial field updates aren't supported"], category: "powerapps" },
  { front: "What is Filter in PowerApps?", back: "Returns only records that match a condition. Equivalent to a WHERE clause in SQL or list comprehension in Python", hint: "Filter narrows down a table to just the rows you want. Filter(Tasks, Status = \"Active\") gives you only active tasks. It's non-destructive — the original data source is untouched. Combine it with a Gallery to show a filtered view of a SharePoint list in real time.", explanation: "Filter is non-destructive — it returns a subset without touching the source. Set a Gallery's Items to Filter(Tasks, Status = \"Active\") and it updates live. Watch for delegation warnings: complex filters may only process the first 500–2000 rows.", distractors: ["Sorts records in a table by a specified column — equivalent to ORDER BY in SQL", "Returns only records that match a condition, but processes all records locally — it always delegates to SharePoint", "Removes matching records permanently from a data source — equivalent to DELETE WHERE in SQL"], category: "powerapps" },
  { front: "What is ForAll in PowerApps?", back: "Loops through every record in a table and does something. Equivalent to a for loop", hint: "ForAll lets you run an action on every row in a table. ForAll(Orders, Patch(Archive, Defaults(Archive), {Title: ThisRecord.Title})) would copy every order to an archive list. ThisRecord refers to the current row in the loop — like 'item' in a Python for loop.", explanation: "ForAll is PowerApps' loop — it runs a formula once for every row in a table. Use ThisRecord to reference the current row's fields. ForAll(Items, Patch(Archive, Defaults(Archive), {Title: ThisRecord.Title})) bulk-copies records.", distractors: ["Filters a table and returns only the records where a specified condition is true", "Loops through a table but only reads values — it cannot write or modify any records", "Loops through every record and does something, but stops as soon as one action fails"], category: "powerapps" },
  { front: "What is Set() in PowerApps?", back: "Creates or updates a global variable accessible anywhere in the app", hint: "Set() stores a value you want to use across multiple screens. Set(UserName, \"Teresa\") makes UserName available everywhere. Unlike UpdateContext, you don't need to pass it between screens. Global variables are great for user info, app state, or toggle flags.", explanation: "Set() creates global variables — accessible on every screen without passing them around. Set(CurrentUser, User().FullName) on app start makes the user's name available everywhere. Use it for app-wide state, not screen-specific UI toggles.", distractors: ["Creates a local variable only accessible on the screen where it was defined", "Creates a global variable but only for storing boolean values — use UpdateContext for text or numbers", "Updates a record in a data source — equivalent to Patch but with simpler syntax for single fields"], category: "powerapps" },
  { front: "What is UpdateContext() in PowerApps?", back: "Creates or updates a local variable only accessible on the current screen", hint: "UpdateContext is for screen-level state — things that only matter on one screen, like whether a dialog is open or which tab is selected. UpdateContext({ShowModal: true}) is cleaner than a global for local UI logic. Use Set() if you need the value on another screen.", explanation: "UpdateContext is screen-scoped — perfect for UI state that doesn't need to travel. UpdateContext({ShowDeleteDialog: true}) on a button toggles a confirmation modal. If you navigate away and back, the variable resets unless you re-initialise it.", distractors: ["Creates a global variable accessible on all screens — equivalent to Set() but with different syntax", "Updates a record in a SharePoint list — similar to Patch but designed for context-aware updates", "Creates a local variable accessible on the current screen and any screens it navigates to"], category: "powerapps" },
  { front: "What is delegation in PowerApps?", back: "When PowerApps hands the filtering/sorting work to SharePoint. If it can't delegate, it downloads all records locally and filters — risky with large datasets", hint: "Delegation determines where the heavy lifting happens. Delegable functions like Filter with simple conditions run on the server — fast and safe with thousands of rows. Non-delegable operations pull all records to the app (capped at 500–2000) then filter locally. Always check the blue delegation warning in the formula bar.", explanation: "Delegation = server does the work. Non-delegable = app downloads everything first (capped at 500–2000 rows). If your list has 5000 items and Filter isn't delegable, you'll silently miss rows. Always check the blue delegation warning in the formula bar.", distractors: ["When PowerApps caches all records locally for faster filtering — delegation improves performance by avoiding server calls", "When PowerApps hands filtering to SharePoint, and non-delegable queries are simply blocked and return an error", "When PowerApps filters data on the server — delegation only applies to Search(), not Filter() or Sort()"], category: "powerapps" },
  { front: "What is a boolean flip?", back: "Switching true to false or false to true. In Python: not x. In PowerApps/JS: !x", hint: "Flipping a boolean toggles state — like a light switch. If isMenuOpen is true, !isMenuOpen gives you false. In PowerApps: UpdateContext({MenuOpen: !MenuOpen}) toggles a menu open and closed with one button. It's cleaner than writing an If() each time.", explanation: "A boolean flip is a toggle — one button, two states. Instead of If(MenuOpen, UpdateContext({MenuOpen: false}), UpdateContext({MenuOpen: true})), just write UpdateContext({MenuOpen: !MenuOpen}). Cleaner and less error-prone.", distractors: ["Converting a boolean to its integer equivalent — true becomes 1 and false becomes 0", "Switching true to false using Not(), but !x only works in Python — PowerApps requires the Not() function", "Comparing two booleans to check if they have opposite values — returns true if one is true and one is false"], category: "fundamentals" },
  { front: "What is the difference between Collect and ClearCollect?", back: "Collect adds to existing data. ClearCollect wipes first then adds — prevents duplicate or stale data", hint: "Imagine a basket: Collect() keeps dropping items in — run it twice and you have duplicates. ClearCollect() empties the basket first, then fills it. Use Collect when building up data incrementally (e.g. adding a selected item). Use ClearCollect when refreshing a full dataset from a source.", explanation: "Collect accumulates — good for building a cart or selection list. ClearCollect replaces — good for loading fresh data on screen open. A common bug: using Collect on a screen's OnVisible means data doubles every time you navigate back.", distractors: ["Collect creates a new collection if it doesn't exist; ClearCollect only works on collections that already exist", "Collect adds records one at a time; ClearCollect adds an entire table at once — neither removes existing data", "Collect and ClearCollect behave identically — the Clear prefix is just a naming convention with no functional difference"], category: "powerapps" },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

const CAT_COLORS = {
  fundamentals: { bar: "#6A9BCC", light: "#dbeafe", text: "#1e3a5f" },
  types:        { bar: "#a78bfa", light: "#ede9fe", text: "#3b0764" },
  syntax:       { bar: "#f59e0b", light: "#fef3c7", text: "#78350f" },
  powerapps:    { bar: "#22c55e", light: "#dcfce7", text: "#14532d" },
};

function ScoreBar({ label, correct, total, colors, improvements, catKey }) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  const link = MS_LEARN_LINKS[catKey];
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-semibold text-gray-800 text-sm">{label}</span>
        <span className="text-sm font-bold" style={{ color: colors.bar }}>{correct}/{total} — {pct}%</span>
      </div>
      <div className="w-full rounded-full h-3 bg-gray-100 overflow-hidden">
        <div className="h-3 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: colors.bar }} />
      </div>
      {improvements && (
        <p className="text-xs mt-1.5 leading-snug" style={{ color: colors.text }}>{improvements}</p>
      )}
      {pct < 80 && link && (
        <a href={link.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs mt-1.5 underline underline-offset-2 hover:opacity-70 transition-opacity"
          style={{ color: colors.bar }}>
          📖 {link.label} — Microsoft Learn
        </a>
      )}
    </div>
  );
}

const MS_LEARN_LINKS = {
  fundamentals: { label: "Web Development 101: Intro to Programming", url: "https://learn.microsoft.com/en-us/training/paths/web-development-101/" },
  types: { label: "JavaScript Variables & Data Types", url: "https://learn.microsoft.com/en-us/training/modules/web-development-101-variables/" },
  syntax: { label: "Make Decisions with JavaScript", url: "https://learn.microsoft.com/en-us/training/modules/web-development-101-if-else/" },
  powerapps: { label: "Get Started with Power Apps Canvas Apps", url: "https://learn.microsoft.com/en-us/training/modules/get-started-with-powerapps/" },
};

const IMPROVEMENT_TIPS = {
  fundamentals: [
    { max: 50, tip: "Focus on the building blocks — variables, functions, loops, and conditionals are the grammar of every language. Try writing small pseudocode examples for each." },
    { max: 79, tip: "Solid base! Revisit conditionals and loops — understanding how they nest together will unlock a lot of PowerApps formula logic." },
    { max: 100, tip: "Strong grasp of fundamentals. You're ready to apply these confidently in PowerApps and Python." },
  ],
  types: [
    { max: 50, tip: "Data types trip up a lot of learners. The key distinction to nail: string vs integer vs boolean. Try thinking about what type each field in a form would be." },
    { max: 79, tip: "Good progress. The trickier ones — float vs integer, null vs empty string — are worth revisiting. These cause real bugs in PowerApps formulas." },
    { max: 100, tip: "Excellent — you clearly understand how data is typed and stored. This will make debugging PowerApps errors much easier." },
  ],
  syntax: [
    { max: 50, tip: "Syntax is the punctuation of code. Focus on = vs ==, what semicolons and commas do, and how {} differs across languages. Small errors here cause big failures." },
    { max: 79, tip: "You've got the basics. The operator questions (!=, !, ==) are worth drilling — they appear constantly in PowerApps conditions and Python logic." },
    { max: 100, tip: "Clean syntax knowledge. You'll write cleaner formulas and spot errors faster because of this." },
  ],
  powerapps: [
    { max: 50, tip: "PowerApps has its own quirks. Prioritise Patch, Filter, Set vs UpdateContext, and delegation — these are the four things you'll use in almost every app." },
    { max: 79, tip: "Good foundation. Delegation and the difference between Set/UpdateContext are the most important gaps to close — they affect how apps behave at scale." },
    { max: 100, tip: "Impressive PowerApps knowledge. You're well-equipped to build and debug real apps." },
  ],
};

function getTip(catKey, pct) {
  const tips = IMPROVEMENT_TIPS[catKey];
  return tips.find(t => pct <= t.max)?.tip || tips[tips.length - 1].tip;
}

export default function App() {
  const [cards] = useState(() => shuffle(CARDS));
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState({});
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const [peeked, setPeeked] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const card = cards[index];
  const correct = card?.back;

  useEffect(() => {
    setSelected(null);
    setExplanation(null);
    setPeeked(false);
    setCardFlipped(false);
    setChoices(shuffle([card.back, ...card.distractors]));
  }, [index]);

  const handleSelect = (choice) => {
    if (selected !== null) return;
    setSelected(choice);
    const isCorrect = choice === correct;
    setResults(r => ({ ...r, [index]: isCorrect }));
    setExplanation(card.explanation);
  };

  const handleNext = () => {
    if (animating) return;
    if (index + 1 >= cards.length) { setDone(true); return; }
    setAnimating(true);
    setTimeout(() => { setIndex(i => i + 1); setAnimating(false); }, 200);
  };

  const handleRestart = () => {
    setIndex(0);
    setResults({});
    setSelected(null);
    setExplanation(null);
    setDone(false);
  };

  if (done) {
    const totalCorrect = Object.values(results).filter(Boolean).length;
    const totalPct = Math.round((totalCorrect / cards.length) * 100);

    const catStats = Object.keys(CATEGORIES).map(key => {
      const catCards = cards.map((c, i) => ({ c, i })).filter(({ c }) => c.category === key);
      const correct = catCards.filter(({ i }) => results[i]).length;
      const total = catCards.length;
      const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
      return { key, label: CATEGORIES[key], correct, total, pct };
    });

    const weakest = [...catStats].sort((a, b) => a.pct - b.pct)[0];

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: '#6A9BCC' }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{totalPct >= 80 ? "🎉" : totalPct >= 50 ? "💪" : "📚"}</div>
            <h2 className="text-3xl font-bold text-gray-800">Quiz complete!</h2>
            <p className="text-gray-400 mt-1 text-sm">Here's how you did across each area</p>
            <div className="mt-3 text-5xl font-bold" style={{ color: '#6A9BCC' }}>{totalCorrect}/{cards.length}</div>
            <div className="text-gray-400 text-sm">{totalPct}% overall</div>
          </div>

          <div className="mt-6">
            {catStats.map(({ key, label, correct, total, pct }) => (
              <ScoreBar
                key={key}
                label={label}
                correct={correct}
                total={total}
                colors={CAT_COLORS[key]}
                improvements={getTip(key, pct)}
              />
            ))}
          </div>

          <div className="mt-6 rounded-2xl p-4 text-sm" style={{ backgroundColor: CAT_COLORS[weakest.key].light, color: CAT_COLORS[weakest.key].text }}>
            <p className="font-semibold mb-1">📌 Priority focus: {weakest.label}</p>
            <p>This was your weakest area at {weakest.pct}%. Spending time here will have the biggest impact on your overall fluency.</p>
            <a href={MS_LEARN_LINKS[weakest.key].url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs mt-2 underline underline-offset-2 hover:opacity-70 transition-opacity font-medium">
              📖 Start here: {MS_LEARN_LINKS[weakest.key].label} — Microsoft Learn
            </a>
          </div>

          <button onClick={handleRestart} className="w-full mt-6 py-3 rounded-full text-white font-medium text-base hover:opacity-90 transition-opacity" style={{ backgroundColor: '#6A9BCC' }}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#6A9BCC' }}>
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-bold tracking-tight">⚡ Logic & Low-Code</h1>
          <p className="text-white/60 text-sm mt-1">Coding fundamentals with a PowerApps edge</p>
        </div>

        <div className="flex justify-between text-white/80 text-sm mb-3 px-1">
          <span>{index + 1} / {cards.length}</span>
          <span className="capitalize" style={{ color: CAT_COLORS[card.category]?.light }}>
            {CATEGORIES[card.category]}
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1.5 mb-6">
          <div className="h-1.5 rounded-full bg-white transition-all" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
        </div>

        {/* Flip card */}
        <div className="mb-5" style={{ perspective: '1000px' }}>
          <div
            className="relative w-full transition-transform duration-500 cursor-pointer"
            style={{ transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)', minHeight: '150px', height: cardFlipped ? 'auto' : '150px' }}
            onClick={() => { setCardFlipped(f => !f); setPeeked(true); }}
          >
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center px-8" style={{ backfaceVisibility: 'hidden', minHeight: '150px' }}>
              <p className="text-gray-800 text-xl font-semibold text-center leading-snug">{card.front}</p>
              <p className="text-gray-400 text-xs mt-3">Click to peek at a hint</p>
            </div>
            <div className="absolute inset-0 rounded-3xl shadow-xl flex flex-col items-center justify-center px-8 py-6" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)', backgroundColor: '#f0fdf4', minHeight: '150px' }}>
              <p className="text-green-800 text-sm text-center leading-relaxed">{card.hint}</p>
              <p className="text-green-400 text-xs mt-3 shrink-0">Click to flip back</p>
            </div>
          </div>
        </div>

        {peeked && selected === null && (
          <p className="text-white/50 text-xs text-center mb-2 italic">You peeked — try to answer honestly!</p>
        )}

        <div className="flex flex-col gap-3">
          {choices.map((choice, i) => {
            const isSelected = selected === choice;
            const isCorrect = choice === correct;
            let bgStyle = {};
            let textClass = "text-gray-700";
            let icon = null;
            if (selected !== null) {
              if (isCorrect) { bgStyle = { backgroundColor: '#22c55e' }; textClass = "text-white"; icon = <CheckCircle size={18} className="shrink-0 mt-0.5" />; }
              else if (isSelected) { bgStyle = { backgroundColor: '#ef4444' }; textClass = "text-white"; icon = <XCircle size={18} className="shrink-0 mt-0.5" />; }
              else { bgStyle = { backgroundColor: '#e5e7eb' }; textClass = "text-gray-400"; }
            }
            return (
              <button key={i} onClick={() => handleSelect(choice)} disabled={selected !== null}
                className={`w-full bg-white rounded-2xl px-5 py-4 text-left font-medium shadow transition-all flex items-start gap-3 ${textClass} ${selected === null ? 'hover:bg-gray-50' : ''}`}
                style={selected !== null ? bgStyle : {}}>
                {icon}
                <span className="text-sm leading-snug">{choice}</span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 rounded-2xl px-5 py-4 text-sm leading-relaxed"
            style={{ backgroundColor: selected === correct ? '#bbf7d0' : '#fecaca', color: selected === correct ? '#14532d' : '#7f1d1d' }}>
            {selected !== correct && <p className="font-semibold mb-1">✗ Correct answer: <span className="font-normal italic">{correct}</span></p>}
            {explanation && <p>{selected === correct && "✓ "}{explanation}</p>}
          </div>
        )}

        {selected !== null && (
          <button onClick={handleNext} className="w-full mt-5 py-3 bg-gray-900 text-white rounded-full font-medium text-base hover:bg-gray-800 transition-colors">
            {index + 1 >= cards.length ? "See results →" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}
