import React from 'react';

function NavNotice() {
  return (
    <li className='nav-item dropdown'>
      <a className='nav-link nav-icon' href='#' data-bs-toggle='dropdown'>
        <i className='bi bi-bell'></i>
        <span className='badge bg-primary badge-number'>0</span>
      </a>
      {/* <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications'>
        <li className='dropdown-header'>
          you have 4 notification
          <a>
            <span className='badge rounded-pill bg-primary p-2 ms-2'>view all</span>
          </a>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li className='notification-item'>
          <i className='bi bi-exclamation-circle text-warning'></i>
          <div>
            <h4>Lorem Ipsum</h4>
            <p>Quae dolorem earum veritatis oditseno</p>
            <p>30min.ago</p>
          </div>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li className='notification-item'>
          <i className='bi bi-x-circle text-danger'></i>
          <div>
            <h4>Atqye rerum nesciut</h4>
            <p>que dolerm gtyhr gfygtv</p>
            <p>1hr .ago</p>
          </div>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li className='notification-item'>
          <i className='bi bi-check-circle text-success'></i>
          <div>
            <h4>sit ftgfhugh</h4>
            <p>yyyyyyyyyyy ggtdgudvji</p>
            <p>2hrs .ago</p>
          </div>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li className='notification-item'>...</li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li className='notification-item'>
          <i className='bi bi-info-circle text-primary'></i>
          <div>
            <h4>sit ftgfhugh</h4>
            <p>yykkkkkkyyyy ggtdgudvji</p>
            <p>4hrs .ago</p>
          </div>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li className='dropdown-footer'>
          <a href='#'> show all notification </a>
        </li>
      </ul> */}
    </li>
  );
}

export default NavNotice;
