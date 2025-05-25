def classify_note(text: str) -> str:
    """
    Classifies a note based on keywords in its text.
    """
    lower_text = text.lower()

    # Rule 1: Quotes
    if text.startswith('"') and text.endswith('"'):
        return "Quotes"

    # Rule 2: Shopping List
    shopping_keywords = ['buy ', 'purchase ', 'shop ', 'market', 'store', 'groceries', 'pick up ']
    if any(keyword in lower_text for keyword in shopping_keywords):
        return "Shopping List"

    # Rule 3: Tasks
    task_keywords = ['call ', 'email ', 'schedule ', 'task', 'to-do', 'todo', 'complete ', 'finish ', 'send ', 'need to ']
    if any(keyword in lower_text for keyword in task_keywords):
        return "Tasks"

    # Rule 4: Ideas
    idea_keywords = ['idea', 'think of', 'concept', 'brainstorm', 'what if', 'consider ']
    if any(keyword in lower_text for keyword in idea_keywords):
        return "Ideas"

    # Rule 5: General Notes
    return "General Notes"
