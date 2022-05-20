<?php
include("develop.php");
?>
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <style>
  #customers {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  #customers td, #customers th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  #customers tr:nth-child(even){background-color: #f2f2f2;}

  #customers tr:hover {background-color: #ddd;}

  #customers th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
  }
  </style>
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-sm-8">
        <?php echo $deleteMsg??''; ?>
        <div class="table-responsive">
          <table class="table table-bordered", id="customers">
            <thead><tr>
              <th>Position</th>
              <th>Name</th>
              <th>Movements</th>
            </tr>
            </thead>
          <?php
            if(is_array($fetchData)){
              $sn=1;
            foreach($fetchData as $data){
          ?>
          <tbody>
            <tr>
              <td><?php echo $sn; ?></td>
              <td><?php echo $data['nom']??''; ?></td>
              <td><?php echo $data['punts']??''; ?></td>
            </tr>
            <?php
            $sn++;}}?>
          </tbody>
          </table>
          <a href="front/index.html" class="btn btn-success" >Start again!!!</a>

        </div>
      </div>
    </div>
  </div>
</body>
</html>
