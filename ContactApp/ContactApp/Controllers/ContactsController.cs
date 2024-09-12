using ContactApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ContactsController : ControllerBase
{

     // getting the instance of db and injecting it to the controller 

    private readonly ContactDbContext _context;

    public ContactsController(ContactDbContext context)
    {
        _context = context;
    }


    // getting the list of contacts 
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contact>>> GetContacts(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string sortBy = "name",
    [FromQuery] string sortOrder = "asc",
    [FromQuery] string searchQuery="")
    {
        if (pageNumber <= 0)
        {
            return BadRequest("Page number must be greater than 0.");
        }

        if (pageSize <= 0)
        {
            return BadRequest("Page size must be greater than 0.");
        }

        if (sortOrder != "asc" && sortOrder != "desc")
        {
            return BadRequest("Sort order must be 'asc' or 'desc'.");
        }

        try
        {
            var totalContacts = await _context.Contacts.CountAsync();

            IQueryable<Contact> query = _context.Contacts;
            if (!string.IsNullOrEmpty(searchQuery))
            {
                searchQuery = searchQuery.ToLower();
                query = query.Where(c => c.Name.ToLower().Contains(searchQuery) ||
                                         c.Mobile.Contains(searchQuery));
            }

            // Apply sorting
            switch (sortBy.ToLower())
            {
                case "name":
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(c => c.Name)
                        : query.OrderByDescending(c => c.Name);
                    break;
                case "mobile":
                    query = sortOrder.ToLower() == "asc"
                        ? query.OrderBy(c => c.Mobile)
                        : query.OrderByDescending(c => c.Mobile);
                    break;
                // Add more sorting options here if needed
                default:
                    return BadRequest("Invalid sortBy parameter.");
            }

            // Apply pagination
            var contacts = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var metadata = new
            {
                TotalCount = totalContacts,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling((double)totalContacts / pageSize)
            };

            Response.Headers.Add("X-Pagination", System.Text.Json.JsonSerializer.Serialize(metadata));

            return Ok(contacts);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the contacts.");
        }
    }



    // posting the contact 
    [HttpPost]
    public async Task<ActionResult<Contact>> PostContact(Contact contact)
    {
        if (contact == null)
        {
            return BadRequest("Contact data is null.");
        }

        try
        {
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContacts), new { id = contact.Id }, contact);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the contact.");
        }
    }



    // updating the contact
    [HttpPut("{id}")]
    public async Task<IActionResult> PutContact(int id, Contact contact)
    {
        if (id != contact.Id)
        {
            return BadRequest();
        }

        _context.Entry(contact).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ContactExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        return NoContent();
    }



    // deleting the contact 
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContact(int id)
    {
        var contact = await _context.Contacts.FindAsync(id);
        if (contact == null)
        {
            return NotFound();
        }

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ContactExists(int id)
    {
        return _context.Contacts.Any(e => e.Id == id);
    }

    [HttpGet("/getcount")]
    public async Task<int> GetTotalContactsCountAsync()
    {
        return await _context.Contacts.CountAsync();
    }




}
