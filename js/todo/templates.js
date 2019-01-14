export const listItemFactory = item => (
    $(`
     <div class="list-group-item d-flex justify-content-between align-items-center ${item.isDone && 'list-group-item-light complete'}" data-id="${item.id}">
        <div class="form-check">
            <input class="form-check-input" type="checkbox" ${item.isDone && 'checked'} id="defaultCheck1">
            <label class="form-check-label" for="defaultCheck1">
                ${item.text}
            </label>
        </div>
        <button class="btn btn-outline-danger delete"><i class="fas fa-trash"></i></button>
    </div>
    `)
);

export const todoLayout = `
    <div class="row">
        <form class="col justify-content-center">
            <div class="form-group mb-0">
                <input type="text" class="form-control form-control-x-lg" name="todo" placeholder="What needs doing?">
            </div>
        </form>
    </div>
    <div class="row mt-1">
        <div class="col justify-content-center todo-list-wrapper">
            <div class="list-group">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="row d-flex justify-content-between">
                <div class="col-12 col-sm-7 col-md-6 col-lg-4 mt-1 btn-group sort-actions" role="group" aria-label="Basic example">
                  <button type="button" data-toggle="tooltip" data-placement="bottom" title="Sort by text (ASC)" data-field="text" data-order="-1" class="btn btn-secondary"><i class="fas fa-sort-alpha-up"></i></button>
                  <button type="button" data-toggle="tooltip" data-placement="bottom" title="Sort by text (DESC)" data-field="text" data-order="1" class="btn btn-secondary"><i class="fas fa-sort-alpha-down"></i></button>
                  <button type="button" data-toggle="tooltip" data-placement="bottom" title="Sort with incomplete items on top" data-field="isDone" data-order="-1" class="btn btn-secondary btn-info"><i class="fas fa-long-arrow-alt-up"></i><i class="fas fa-check-double"></i></button>
                  <button type="button" data-toggle="tooltip" data-placement="bottom" title="Sort by created time (ASC)" data-field="createdAt" data-order="-1" class="btn btn-secondary"><i class="fas fa-long-arrow-alt-up"></i><i class="fas fa-clock"></i></button>
                  <button type="button" data-toggle="tooltip" data-placement="bottom" title="Sort by created time (DESC)" data-field="createdAt" data-order="1" class="btn btn-secondary"><i class="fas fa-long-arrow-alt-down"></i><i class="fas fa-clock"></i></button>
                </div>
                <div class="col-12 col-sm-5 col-md-5 col-lg-4 mt-1 btn-group" role="group" aria-label="Basic example">
                  <button type="button" class="btn btn-secondary clear-complete"><i class="fas fa-minus-circle"></i> Clear Completed</button>
                </div>
            </div>
        </div>
    </div>
`;

export const noData = `
<div class="jumbotron text-center bg-white mb-0">
  <h1 class="display-4"><i class="fas fa-umbrella-beach"></i> All finished up!</h1>
  <p class="lead">Enter something you want to do in the text box above and hit enter to add new items.</p>
</div>
`;