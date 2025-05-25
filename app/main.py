from flask import Flask, request, jsonify, render_template
from .classifier import classify_note

app = Flask(__name__)

notes = []
next_note_id = 1

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)

@app.route('/api/notes', methods=['POST'])
def add_note():
    global next_note_id
    data = request.get_json()
    note_text = data.get('text')

    if not note_text:
        return jsonify({'error': 'Note text is required'}), 400

    category = classify_note(note_text)
    new_note = {
        'id': next_note_id,
        'text': note_text,
        'category': category, # Use the result from classify_note
        'raw_text': note_text
    }
    notes.append(new_note)
    next_note_id += 1
    return jsonify(new_note), 201

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def edit_note(note_id):
    data = request.get_json()
    new_text = data.get('text')

    if not new_text:
        return jsonify({'error': 'New text is required'}), 400

    for note in notes:
        if note['id'] == note_id:
            note['text'] = new_text
            note['raw_text'] = new_text # Assuming raw_text should also be updated
            note['category'] = classify_note(new_text)
            return jsonify(note)
    
    return jsonify({'error': 'Note not found'}), 404

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    global notes
    original_length = len(notes)
    notes = [note for note in notes if note['id'] != note_id]
    if len(notes) < original_length:
        return jsonify({'message': 'Note deleted successfully'}), 200
    else:
        return jsonify({'error': 'Note not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
