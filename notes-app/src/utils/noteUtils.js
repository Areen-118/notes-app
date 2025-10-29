export function findNote(note, searchlist)
{
    let found = null;
    searchlist.forEach(element => {
        if(typeof(note) == "object")
        {
            if(element._id === note._id)
                found = element;
        }
        else
        {
            if(element._id === note)
                found = element;
        }
            
    });
    return found;
}