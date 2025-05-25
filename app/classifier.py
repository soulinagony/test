def classify_note(text: str) -> dict:
    """
    Classifies a note based on keywords in its text.
    Returns a dictionary with 'category' and 'trigger'.
    """
    lower_text = text.lower()

    # Rule 1: Quotes
    if text.startswith('"') and text.endswith('"'):
        return {'category': "Quotes", 'trigger': 'paired quotes "..."'}
    if text.startswith('“') and text.endswith('”'):
        return {'category': "Quotes", 'trigger': 'paired curly quotes “...”'}

    quote_keywords = [' quote', 'quote ', '“', '”', '"', 'said ', 'says ', 'attributed to']
    for keyword in quote_keywords:
        if keyword in lower_text:
            trigger_keyword = keyword.strip()
            if trigger_keyword in ['“', '”', '"']:
                 return {'category': "Quotes", 'trigger': f"quote character: '{trigger_keyword}'"}
            return {'category': "Quotes", 'trigger': f"keyword: '{trigger_keyword}'"}

    # Rule 2: Shopping List
    shopping_keywords = ['buy', 'purchase', 'shop', 'market', 'store', 'groceries', 'pick up', 'shopping']
    for keyword in shopping_keywords:
        if keyword in lower_text:
            return {'category': "Shopping List", 'trigger': f"keyword: '{keyword}'"}

    # Rule 3: Tasks
    task_keywords = ['call ', 'email ', 'schedule ', 'task', 'to-do', 'todo', 'complete ', 'finish ', 'send ', 'need to ']
    for keyword in task_keywords:
        if keyword in lower_text:
            return {'category': "Tasks", 'trigger': f"keyword: '{keyword.strip()}'"}

    # Rule 4: Ideas
    idea_keywords = ['idea', 'think of', 'concept', 'brainstorm', 'what if', 'consider ']
    for keyword in idea_keywords:
        if keyword in lower_text:
            return {'category': "Ideas", 'trigger': f"keyword: '{keyword.strip()}'"}

    # Rule 5: General Notes
    return {'category': "General Notes", 'trigger': 'default rule'}
