import DataLayer from './DataLayer';
import {listItemFactory, todoLayout, noData} from './templates';

/**
 * The main Application class. Initialises the DOM, data layer, registers events and coordinates the DOM  to reflect
 * changes in data.
 */
class Todo {
    /**
     * Constructor is called when a class is initialised for ex: const app = new Todo()
     * A selector can be passed to indicate the container into which the app needs to be rendered.
     * @param {string} [selector='#todo-container'] - jQuery compatible selector to select the container
     */
    constructor(selector = '#todo-container') {
        // Build Layout
        this.$el = $(selector);
        this.$el.html($(todoLayout));

        // Initialise tool tips
        this.$el.find('[data-toggle="tooltip"]').tooltip({delay: {show: 1500, hide: 0}});

        // Get jQuery refs to important elements
        this.$listGroup = this.$el.find('.list-group');
        this.$form = this.$el.find('form');
        this.$sortActions = this.$el.find('.sort-actions');

        // Initialise DataLayer
        this._dataLayer = new DataLayer();

        // Initialise instance variables
        this.sortMode = ['isDone', -1];

        // Setup event handlers
        this.registerEventListeners();

        // Render list
        this.render();
    }

    /**
     * Helper method to register the event listeners and tie them to relevant actions
     */
    registerEventListeners() {
        // Create a new Todo when the form is submitted
        this.$form.on('submit', e => {

            // Prevent the page from refreshing
            e.preventDefault();

            // Create an item with the value of the 'todo' text field
            this.createItem(this.$form[0].todo.value);

            // Reset the text field to be empty
            this.$form[0].todo.value = '';
        });

        // Delete a todo when the delete button is clicked
        this.$listGroup.on('click', 'button.delete', event => {
            // Get the ID of the todo which needs to be deleted from the data attribute on it's parent
            // div.list-group-item element
            const id = $(event.currentTarget).parents('.list-group-item').data('id');

            // Call the delete action
            this.deleteItem(id);
        });

        // Mark a todo as done/undone when a checkbox is clicked
        this.$listGroup.on('click', 'input[type=checkbox]', event => {

            // Get the checkbox which was clicked
            const {currentTarget} = event;

            // Get the ID of the todo which needs to be updated from the data attribute on it's parent
            // div.list-group-item element
            const id = $(currentTarget).parents('.list-group-item').data('id');

            // Call the toggle action with the checkbox's current checked value
            this.toggleItem(id, currentTarget.checked);
        });

        // Handle clicks on different sort buttons and sort as needed
        this.$sortActions.on('click', 'button.btn', event => {

            // Get the sort button which was clicked
            const $currentTarget = $(event.currentTarget);

            // Get the container of the sort actions
            const $sortActions = $currentTarget.parents('.sort-actions');

            // Clear the btn-info class on all sort buttons (make them all grey and appear inactive)
            $sortActions.find('button').removeClass('btn-info');

            // Add the btn-info class to the button which was clicked (to make it blue and appear active)
            $currentTarget.addClass('btn-info');

            // Remove focus from the button to force clear tooltip
            $currentTarget.blur();

            // Derive the sort parameters from the data attributes of the sort button which was clicked
            const sortMode = [$currentTarget.data('field'), $currentTarget.data('order')];

            // Call the sort action
            this.sort(sortMode);
        });

        // Handle clicks on the clear complete button and trigger the clearCompleted action
        this.$el.find('button.clear-complete').on('click', () => this.clearCompleted());
    }

    /**
     * Action to create an item
     * @param {string} text - The text of the todo to be created
     */
    createItem(text) {
        // Create data layer entry
        this._dataLayer.create(text);
        // Rerender
        this.render();
    }

    /**
     * Action to delete an item
     * @param {string} id - The id of the todo to be deleted
     */
    deleteItem(id) {
        // Delete item in the data layer
        this._dataLayer.deleteOne(id);
        // Rerender
        this.render();
    }

    /**
     * Action to update an item's done status
     * @param {string} id - The id of the todo to be updated
     * @param {boolean} isDone - The item's done status
     */
    toggleItem(id, isDone) {
        // Update the item in the data layer
        this._dataLayer.updateOne(id, {isDone});
        // Rerender
        this.render();
    }

    /**
     * Action to clear completed items from the list
     */
    clearCompleted() {
        // Call the data layer clearCompleted helper
        this._dataLayer.clearCompleted();
        // Rerender
        this.render();
    }

    /**
     * Action to change the sort order of items
     * @param {Array} mode - An array indicating the sort mode to update to
     * @param {string} mode[0] - The field name to sort by
     * @param {number} mode[1] - The sort order to sort by. -1 (negative values) for ASC, 1 (positive values) for DESC
     */
    sort(mode) {
        // Update the sort mode
        this.sortMode = mode;
        // Rerender
        this.render();
    }

    /**
     * Action to update the DOM to be consistent with the Data Layer
     */
    render() {
        const items = this._dataLayer.find({sort: this.sortMode});
        const $html = items.length ? items.map(listItemFactory) : $(noData);
        this.$listGroup.html($html);
    }
}

export default Todo;